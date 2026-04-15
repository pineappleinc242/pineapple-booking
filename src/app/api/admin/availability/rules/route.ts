import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin'

export async function GET() {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin not initialized')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('availability_rules')
      .select('*')
      .order('day_of_week')

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch availability rules' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase admin not initialized')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { rules } = await request.json()

    if (!Array.isArray(rules)) {
      return NextResponse.json({ error: 'Rules must be an array' }, { status: 400 })
    }

    // Delete all existing rules
    const { error: deleteError } = await supabaseAdmin
      .from('availability_rules')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to update rules' }, { status: 500 })
    }

    // Insert new rules
    if (rules.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('availability_rules')
        .insert(rules.map(rule => ({
          day_of_week: rule.day_of_week,
          start_time: rule.start_time,
          end_time: rule.end_time,
          slot_minutes: rule.slot_minutes,
          enabled: rule.enabled
        })))

      if (insertError) {
        console.error('Insert error:', insertError)
        return NextResponse.json({ error: 'Failed to update rules' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Server error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}