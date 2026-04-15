import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'
import { sendBookingEmails } from '../../../../lib/mailer'

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

// Helper function to convert minutes to time string
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

// Check if two time ranges overlap
function timeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const start1Min = timeToMinutes(start1)
  const end1Min = timeToMinutes(end1)
  const start2Min = timeToMinutes(start2)
  const end2Min = timeToMinutes(end2)

  return start1Min < end2Min && end1Min > start2Min
}

// Helper function to convert minutes to time string in 12-hour format
function minutesToTime12Hour(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

// Helper function to format UTC timestamp for display
function formatBookingForDisplay(booking: any) {
  // Handle new UTC timestamp format
  if (booking.booking_datetime) {
    const utcDate = new Date(booking.booking_datetime);

    // Format for local timezone display
    const localDateStr = utcDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const hours = utcDate.getHours()
    const minutes = utcDate.getMinutes()
    const localTimeStr = minutesToTime12Hour(hours * 60 + minutes)

    return {
      ...booking,
      booking_date: localDateStr,
      booking_time: localTimeStr
    };
  }

  // Handle legacy format (separate date/time fields)
  return {
    ...booking,
    booking_date: booking.booking_date || 'N/A',
    booking_time: booking.booking_time || 'N/A'
  };
}

export async function GET() {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin not initialized')
      return NextResponse.json({ ok: false, error: 'Server configuration error' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ ok: false, error: 'Failed to fetch bookings' }, { status: 500 })
    }

    // Format bookings for display (convert UTC to local timezone)
    const formattedBookings = data.map(formatBookingForDisplay)

    return NextResponse.json({ ok: true, bookings: formattedBookings })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  console.log('Env checks:', !!process.env.NEXT_PUBLIC_SUPABASE_URL, !!process.env.SUPABASE_SERVICE_ROLE_KEY, !!process.env.SUPABASE_URL)

  if (!supabaseAdmin) {
    console.error('Supabase admin not initialized')
    return NextResponse.json({ ok: false, error: 'Missing server env vars' }, { status: 500 })
  }

  try {
    const requestBody = await request.json()
    console.log('[BOOKING] TEMP DEBUG - Incoming request body:', requestBody)

    const { full_name, email, service, booking_date, booking_time, phone, notes } = requestBody

    if (!full_name || !email || !service || !booking_date || !booking_time) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure booking_date is in YYYY-MM-DD format and booking_time is in HH:mm format
    const parsedBookingDate = booking_date // Should already be YYYY-MM-DD from date input
    const parsedBookingTime = booking_time // Should already be HH:mm from dropdown value

    console.log('[BOOKING] TEMP DEBUG - Parsed booking_date:', parsedBookingDate)
    console.log('[BOOKING] TEMP DEBUG - Parsed booking_time:', parsedBookingTime)

    // Check for existing booking conflicts - ONLY on date and time (not service)
    const duplicateCheckSQL = `SELECT id FROM bookings WHERE booking_date = '${parsedBookingDate}' AND booking_time = '${parsedBookingTime}'`
    console.log('[BOOKING] TEMP DEBUG - SQL for duplicate check:', duplicateCheckSQL)

    const { data: existingBookings, error: conflictError } = await supabaseAdmin
      .from('bookings')
      .select('id')
      .eq('booking_date', parsedBookingDate)
      .eq('booking_time', parsedBookingTime)

    console.log('[BOOKING] TEMP DEBUG - Duplicate check result:', existingBookings?.length || 0, 'existing bookings found')
    
    if (conflictError) {
      console.error('[BOOKING] Conflict check error:', conflictError)
      return NextResponse.json({ ok: false, error: 'Failed to check for conflicts' }, { status: 500 })
    }

    if (existingBookings && existingBookings.length > 0) {
      console.log(`[BOOKING] REJECTED: Conflict found with existing booking ID ${existingBookings[0].id}`)
      return NextResponse.json({ ok: false, error: 'Time slot already booked' }, { status: 409 })
    }

    console.log(`[BOOKING] ACCEPTED: No conflicts found, proceeding with booking`)

    // Insert booking using standardized formats
    const insertData = {
      full_name,
      email,
      service,
      phone,
      notes,
      booking_date: parsedBookingDate,
      booking_time: parsedBookingTime,
      status: 'confirmed'
    }

    console.log('[BOOKING] TEMP DEBUG - Insert data:', insertData)

    const { data: insertResult, error: insertError } = await supabaseAdmin
      .from('bookings')
      .insert(insertData)
      .select('id')
      .single()

    console.log('[BOOKING] TEMP DEBUG - Insert result:', insertResult)
    console.log('[BOOKING] TEMP DEBUG - Insert error:', insertError)

    console.log(`[BOOKING] SUCCESS: Booking created with ID ${insertResult.id}`)

    // Wait for the confirmation emails to be sent, but catch errors safely so they don't break the booking success!
    try {
      await sendBookingEmails({
        full_name,
        email,
        phone,
        service,
        booking_date: parsedBookingDate,
        booking_time: parsedBookingTime,
        notes
      })
      console.log(`[BOOKING] Emails sent successfully for booking ID ${insertResult.id}`)
    } catch (emailError) {
      console.error(`[BOOKING] Non-fatal Error: Failed to send emails for booking ID ${insertResult.id}:`, emailError)
      // We still return true even if email fails because the booking was successfully recorded in DB
    }

    console.log(`[BOOKING] COMPLETED: Booking process finished successfully for ${full_name} (${email})`)
    return NextResponse.json({ ok: true, bookingId: insertResult.id })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 })
  }
}
