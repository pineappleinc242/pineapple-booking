import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Check if rules already exist
    const { data: existingRules, error: checkError } = await supabaseAdmin
      .from('availability_rules')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('Error checking existing rules:', checkError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (existingRules && existingRules.length > 0) {
      return NextResponse.json({ message: 'Availability rules already exist' })
    }

    // Insert default availability rules
    const { data, error } = await supabaseAdmin
      .from('availability_rules')
      .insert([
        // Weekdays (Monday-Friday, 9 AM - 5 PM)
        { day_of_week: 1, start_time: '09:00', end_time: '17:00', slot_minutes: 60, enabled: true }, // Monday
        { day_of_week: 2, start_time: '09:00', end_time: '17:00', slot_minutes: 60, enabled: true }, // Tuesday
        { day_of_week: 3, start_time: '09:00', end_time: '17:00', slot_minutes: 60, enabled: true }, // Wednesday
        { day_of_week: 4, start_time: '09:00', end_time: '17:00', slot_minutes: 60, enabled: true }, // Thursday
        { day_of_week: 5, start_time: '09:00', end_time: '17:00', slot_minutes: 60, enabled: true }, // Friday
        // Weekends (Saturday-Sunday, 10 AM - 4 PM)
        { day_of_week: 6, start_time: '10:00', end_time: '16:00', slot_minutes: 60, enabled: true }, // Saturday
        { day_of_week: 0, start_time: '10:00', end_time: '16:00', slot_minutes: 60, enabled: true }  // Sunday
      ])

    if (error) {
      console.error('Error seeding availability rules:', error)
      return NextResponse.json({ error: 'Failed to seed availability rules' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Successfully seeded default availability rules',
      rules_added: data?.length || 0
    })

  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}