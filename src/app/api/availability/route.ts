import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

// Force dynamic rendering and no caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

// Helper function to convert minutes to time string in 12-hour format
function minutesToTime12Hour(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

// Helper function to convert 12-hour format to 24-hour format
function convert12HourTo24Hour(time12: string): string {
  const [time, period] = time12.split(' ')
  const [hoursStr, minutes] = time.split(':')
  let hours = parseInt(hoursStr)

  if (period === 'PM' && hours !== 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

// Check if two time ranges overlap
function timeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const start1Min = timeToMinutes(start1)
  const end1Min = timeToMinutes(end1)
  const start2Min = timeToMinutes(start2)
  const end2Min = timeToMinutes(end2)

  return start1Min < end2Min && end1Min > start2Min
}

// Convert UTC timestamp to local date and time strings
function formatBookingForDisplay(utcDateTime: string) {
  const date = new Date(utcDateTime)
  const localDate = date.toLocaleDateString('en-CA') // YYYY-MM-DD format
  const localTime = date.toLocaleTimeString('en-GB', { hour12: false }).substring(0, 5) // HH:MM format
  return { date: localDate, time: localTime }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin not initialized')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    const serviceParam = searchParams.get('service')

    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 })
    }

    if (!serviceParam) {
      return NextResponse.json({ error: 'Service parameter required' }, { status: 400 })
    }

    const date = new Date(dateParam)
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = date.getDay()

    // Load enabled rules for this day
    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('availability_rules')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('enabled', true)

    if (rulesError) {
      console.error('Supabase rules error:', rulesError)
      return NextResponse.json({ error: 'Failed to fetch availability rules' }, { status: 500 })
    }

    // Generate all possible slots from rules
    let allSlots: string[] = []
    for (const rule of rules) {
      const startMinutes = timeToMinutes(rule.start_time)
      const endMinutes = timeToMinutes(rule.end_time)
      const slotMinutes = rule.slot_minutes

      for (let time = startMinutes; time < endMinutes; time += slotMinutes) {
        // Generate slots in HH:mm format (24-hour)
        allSlots.push(minutesToTime(time))
      }
    }

    // Remove duplicates and sort
    allSlots = [...new Set(allSlots)].sort()
    console.log('Generated slots (HH:mm):', allSlots)

    // Load blocks for this date
    const { data: blocks, error: blocksError } = await supabaseAdmin
      .from('availability_blocks')
      .select('*')
      .eq('block_date', dateParam)

    if (blocksError) {
      console.error('Supabase blocks error:', blocksError)
      return NextResponse.json({ error: 'Failed to fetch availability blocks' }, { status: 500 })
    }

    // Filter out slots that overlap with blocks
    let availableSlots = allSlots.filter(slot => {
      // slot is already in HH:mm format, no conversion needed
      const slotEndTime = minutesToTime(timeToMinutes(slot) + 60) // Assume 1 hour slots for overlap check

      return !blocks.some((block: any) =>
        timeRangesOverlap(slot, slotEndTime, block.start_time, block.end_time)
      )
    })

    // Filter out already booked slots (only confirmed bookings block availability)
    let existingBookingsQuery = supabaseAdmin
      .from('bookings')
      .select('booking_date, booking_time')
      .eq('booking_date', dateParam)

    // Only filter by status if the column exists (backwards compatibility)
    try {
      const { data: testQuery } = await supabaseAdmin
        .from('bookings')
        .select('status')
        .limit(1)

      if (testQuery !== null) {
        // Status column exists, filter by confirmed bookings only
        existingBookingsQuery = existingBookingsQuery.eq('status', 'confirmed')
      }
    } catch (err) {
      // Status column doesn't exist, include all bookings (assume they're confirmed)
      console.log('[AVAILABILITY] Status column not found, including all bookings')
    }

    const { data: existingBookings, error: bookingsError } = await existingBookingsQuery

    if (bookingsError) {
      console.error('Supabase bookings error:', bookingsError)
      return NextResponse.json({ error: 'Failed to fetch existing bookings' }, { status: 500 })
    }

    // Remove slots that are already booked (exact time match)
    availableSlots = availableSlots.filter(slot => {
      return !existingBookings.some((booking: any) => booking.booking_time === slot)
    })

    // Convert final available slots to 12-hour format for UI display
    const availableSlots12Hour = availableSlots.map(slot => minutesToTime12Hour(timeToMinutes(slot)))

    console.log(`[AVAILABILITY] Service: ${serviceParam}, Date: ${dateParam}, DayOfWeek: ${dayOfWeek}`)
    console.log(`[AVAILABILITY] Generated slots: ${allSlots.length} (${allSlots.join(', ')})`)
    console.log(`[AVAILABILITY] After blocks filtering: ${availableSlots.length}`)
    console.log(`[AVAILABILITY] After booking filtering: ${availableSlots.length}`)
    console.log(`[AVAILABILITY] Final available slots (HH:mm): ${availableSlots.length} (${availableSlots.join(', ')})`)
    console.log(`[AVAILABILITY] Final available slots (12h display): ${availableSlots12Hour.length} (${availableSlots12Hour.join(', ')})`)

    const response = NextResponse.json({
      date: dateParam,
      service: serviceParam,
      slots: availableSlots  // Return HH:mm format for form values
    })

    // Ensure no caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response

  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}