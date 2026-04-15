import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../../lib/supabaseAdmin'
import { sendBookingActionEmails } from '../../../../../../../lib/mailer'

// Admin token authentication
function authenticateAdmin(request: NextRequest): boolean {
  const adminToken = request.headers.get('x-admin-token')
  const expectedToken = process.env.ADMIN_TOKEN

  if (!expectedToken) {
    console.error('ADMIN_TOKEN not configured')
    return false
  }

  return adminToken === expectedToken
}

// Helper function to convert time string to minutes since midnight
function timeToMinutes(time: string): number {
  // Handle both 24-hour format ("11:00") and 12-hour format ("11:00 AM")
  if (time.includes('AM') || time.includes('PM')) {
    // 12-hour format: "11:00 AM"
    const [timePart, period] = time.split(' ')
    const [hoursStr, minutesStr] = timePart.split(':')
    let hours = parseInt(hoursStr)

    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }

    return hours * 60 + parseInt(minutesStr)
  } else {
    // 24-hour format: "11:00"
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Authenticate admin
    if (!authenticateAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookingId = id

    const { new_date, new_time } = await request.json()

    if (!new_date || !new_time) {
      return NextResponse.json({ error: 'New date and time are required' }, { status: 400 })
    }

    // Get current booking details
    const { data: currentBooking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError || !currentBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Check if the new slot is available (global availability check)
    const { data: conflictingBookings, error: conflictError } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('booking_date', new_date)
      .eq('booking_time', new_time)
      .neq('status', 'CANCELLED') // Exclude cancelled bookings
      .neq('id', bookingId) // Exclude current booking

    if (conflictError) {
      console.error('Conflict check error:', conflictError)
      return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 })
    }

    if (conflictingBookings && conflictingBookings.length > 0) {
      return NextResponse.json({ error: 'The selected time slot is not available' }, { status: 409 })
    }

    // Store old values for reschedule tracking
    const oldDate = currentBooking.booking_date
    const oldTime = currentBooking.booking_time

    // Update booking with new date/time and reschedule info
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        booking_date: new_date,
        booking_time: new_time,
        status: 'RESCHEDULED',
        rescheduled_from_date: oldDate,
        rescheduled_from_time: oldTime,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to reschedule booking' }, { status: 500 })
    }

    // Send email notifications (don't block on failure)
    try {
      const updatedBooking = { ...currentBooking, booking_date: new_date, booking_time: new_time, rescheduled_from_date: oldDate, rescheduled_from_time: oldTime }
      await sendBookingActionEmails('reschedule', updatedBooking)
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
      // Continue - don't fail the booking action due to email issues
    }

    return NextResponse.json({
      success: true,
      message: 'Booking rescheduled successfully',
      old_date: oldDate,
      old_time: oldTime,
      new_date,
      new_time
    })

  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}