#!/usr/bin/env node

/**
 * Test script for admin booking actions
 * Run this after applying the database migration
 */

const BASE_URL = 'http://localhost:3000'
const ADMIN_TOKEN = 'admin_secure_token_2026_pineapple_booking'

async function testAdminActions() {
  console.log('🧪 Testing Admin Booking Actions...\n')

  try {
    // First, get all bookings
    console.log('1. Fetching bookings...')
    const bookingsResponse = await fetch(`${BASE_URL}/api/admin/bookings`)
    const bookingsData = await bookingsResponse.json()

    if (!bookingsResponse.ok) {
      console.error('❌ Failed to fetch bookings:', bookingsData)
      return
    }

    console.log(`✅ Found ${bookingsData.bookings?.length || 0} bookings`)

    // Find a PENDING booking to test with
    const pendingBooking = bookingsData.bookings?.find(b => b.status === 'PENDING')

    if (!pendingBooking) {
      console.log('⚠️  No PENDING bookings found. Create a booking first, then run this test.')
      return
    }

    console.log(`📋 Testing with booking: ${pendingBooking.full_name} (${pendingBooking.service})`)

    // Test APPROVE action
    console.log('\n2. Testing APPROVE action...')
    const approveResponse = await fetch(`${BASE_URL}/api/admin/bookings/${pendingBooking.id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_TOKEN
      }
    })

    if (approveResponse.ok) {
      console.log('✅ Booking approved successfully')
    } else {
      const error = await approveResponse.json()
      console.error('❌ Approve failed:', error)
    }

    // Test CANCEL action (create another booking first)
    console.log('\n3. Testing CANCEL action...')
    console.log('   Note: Create another PENDING booking to test cancel action')

    // Test RESCHEDULE action
    console.log('\n4. Testing RESCHEDULE action...')
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const newDate = tomorrow.toISOString().split('T')[0]

    const rescheduleResponse = await fetch(`${BASE_URL}/api/admin/bookings/${pendingBooking.id}/reschedule`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_TOKEN
      },
      body: JSON.stringify({
        new_date: newDate,
        new_time: '14:00'
      })
    })

    if (rescheduleResponse.ok) {
      const result = await rescheduleResponse.json()
      console.log('✅ Booking rescheduled successfully')
      console.log(`   From: ${result.old_date} ${result.old_time}`)
      console.log(`   To: ${result.new_date} ${result.new_time}`)
    } else {
      const error = await rescheduleResponse.json()
      console.error('❌ Reschedule failed:', error)
    }

    console.log('\n🎉 Admin actions testing completed!')
    console.log('\n📧 Check your email for notification emails')
    console.log('🔍 Check the admin dashboard to verify status changes')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testAdminActions()