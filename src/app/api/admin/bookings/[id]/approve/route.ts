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

    // Get current booking details
    const { data: currentBooking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError || !currentBooking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (currentBooking.status !== 'PENDING') {
      return NextResponse.json({ error: 'Only pending bookings can be approved' }, { status: 400 })
    }

    // Update booking status
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'APPROVED',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to approve booking' }, { status: 500 })
    }

    // Send email notifications (don't block on failure)
    try {
      await sendBookingActionEmails('approve', currentBooking)
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
      // Continue - don't fail the booking action due to email issues
    }

    return NextResponse.json({ success: true, message: 'Booking approved successfully' })

  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}