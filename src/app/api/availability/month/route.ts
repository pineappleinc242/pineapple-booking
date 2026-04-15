import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function timeToMinutes(time: string): number {
  if (time.includes('AM') || time.includes('PM')) {
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
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

function timeRangesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const start1Min = timeToMinutes(start1)
  const end1Min = timeToMinutes(end1)
  const start2Min = timeToMinutes(start2)
  const end2Min = timeToMinutes(end2)

  return start1Min < end2Min && end1Min > start2Min
}

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const yearParam = searchParams.get('year')
    const monthParam = searchParams.get('month') // 1-12
    const serviceParam = searchParams.get('service')

    if (!yearParam || !monthParam || !serviceParam) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const year = parseInt(yearParam)
    const monthIndex = parseInt(monthParam) - 1 // 0-11
    
    if (isNaN(year) || isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    // Determine start and end dates of the month to query
    const startDate = new Date(year, monthIndex, 1)
    const endDateStr = new Date(year, monthIndex + 1, 0).toLocaleDateString('en-CA') // last day of month
    const startDateStr = startDate.toLocaleDateString('en-CA')

    // Fetch rules (active rules covering day of weeks)
    const { data: rules } = await supabaseAdmin
      .from('availability_rules')
      .select('*')
      .eq('enabled', true)
      
    // Fetch blocks in range
    const { data: blocks } = await supabaseAdmin
      .from('availability_blocks')
      .select('*')
      .gte('block_date', startDateStr)
      .lte('block_date', endDateStr)

    // Fetch bookings in range
    let bookingsQuery = supabaseAdmin
      .from('bookings')
      .select('booking_date, booking_time, status')
      .gte('booking_date', startDateStr)
      .lte('booking_date', endDateStr)

    // Verify if status column exists, we can just fetch and fall back to confirmed only
    const { data: bookingsData, error: bookingsError } = await bookingsQuery
    
    // Fallback if there was an error with the column, try just booking_date and booking_time
    let activeBookings = bookingsData || []
    if (bookingsError && bookingsError.message.includes('status')) {
      const { data: fallbackBookings } = await supabaseAdmin
        .from('bookings')
        .select('booking_date, booking_time')
        .gte('booking_date', startDateStr)
        .lte('booking_date', endDateStr)
      if (fallbackBookings) activeBookings = fallbackBookings
    } else if (bookingsData) {
      // If status column exists, filter by confirmed
      activeBookings = bookingsData.filter((b: any) => b.status === undefined || b.status === null || b.status === 'confirmed')
    }

    const availableDates: string[] = []
    const fullyBookedDates: string[] = []

    // Cache rules by day of week
    const rulesByDay: Record<number, any[]> = {}
    if (rules) {
      rules.forEach((rule: any) => {
        if (!rulesByDay[rule.day_of_week]) rulesByDay[rule.day_of_week] = []
        rulesByDay[rule.day_of_week].push(rule)
      })
    }

    // Number of days in requested month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    
    const todayStr = new Date().toLocaleDateString('en-CA')

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, monthIndex, day)
      const dateStr = currentDate.toLocaleDateString('en-CA')
      
      // Skip past dates to save processing
      if (dateStr < todayStr) continue

      const dayOfWeek = currentDate.getDay()
      const dayRules = rulesByDay[dayOfWeek] || []
      
      if (dayRules.length === 0) continue // No slots available naturally

      // Generate all possible slots for this day
      let allSlots: string[] = []
      for (const rule of dayRules) {
        const startMinutes = timeToMinutes(rule.start_time)
        const endMinutes = timeToMinutes(rule.end_time)
        const slotMinutes = rule.slot_minutes
        for (let time = startMinutes; time < endMinutes; time += slotMinutes) {
          allSlots.push(minutesToTime(time))
        }
      }
      
      allSlots = [...new Set(allSlots)].sort()
      
      if (allSlots.length === 0) continue

      // Filter by blocks
      const dayBlocks = blocks ? blocks.filter((b: any) => b.block_date === dateStr) : []
      let availableSlots = allSlots.filter(slot => {
        const slotEndTime = minutesToTime(timeToMinutes(slot) + 60)
        return !dayBlocks.some((block: any) =>
          timeRangesOverlap(slot, slotEndTime, block.start_time, block.end_time)
        )
      })
      
      // Filter by bookings
      const dayBookings = activeBookings.filter((b: any) => b.booking_date === dateStr)
      if (dayBookings.length > 0) {
        availableSlots = availableSlots.filter(slot => {
          return !dayBookings.some((booking: any) => booking.booking_time === slot)
        })
      }
      
      if (availableSlots.length > 0) {
        availableDates.push(dateStr)
      } else {
        fullyBookedDates.push(dateStr)
      }
    }

    const response = NextResponse.json({
      year,
      month: monthIndex + 1,
      availableDates,
      fullyBookedDates
    })
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response

  } catch (error) {
    console.error('Month availability error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
