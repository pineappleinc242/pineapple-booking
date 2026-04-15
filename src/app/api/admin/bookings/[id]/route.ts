import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin'
import { sendCancellationEmails } from '../../../../../../lib/mailer'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    const { status } = await request.json()

    if (!status || !['confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
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

    // Only allow status changes from confirmed
    if (currentBooking.status !== 'confirmed') {
      return NextResponse.json({ error: 'Can only update confirmed bookings' }, { status: 400 })
    }

    // Update booking status
    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)
      .select('*')
      .single()

    if (updateError) {
      console.error('Status update error:', updateError)
      return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 })
    }

    // Send cancellation email if status changed to cancelled
    if (status === 'cancelled') {
      setImmediate(async () => {
        try {
          await sendCancellationEmails(currentBooking)
        } catch (emailError) {
          console.error('Cancellation email failed:', emailError)
        }
      })
    }

    return NextResponse.json({ booking: updatedBooking })

  } catch (error) {
    console.error('Admin booking update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}