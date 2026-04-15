import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import Link from 'next/link'

export default async function TestPage() {
  let status = 'Testing database connection...'

  try {
    if (!supabaseAdmin) {
      status = '❌ Supabase admin client not initialized - check environment variables'
    } else {
      // Test rules table
      const { data: rules, error: rulesError } = await supabaseAdmin
        .from('availability_rules')
        .select('*')
        .limit(1)

      // Test blocks table
      const { data: blocks, error: blocksError } = await supabaseAdmin
        .from('availability_blocks')
        .select('*')
        .limit(1)

      // Test bookings table
      const { data: bookings, error: bookingsError } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .limit(1)

      status = `
        ✅ Database connection successful!

        Rules table: ${rulesError ? `❌ Error: ${rulesError.message}` : `✅ OK (${rules?.length || 0} records)`}
        Blocks table: ${blocksError ? `❌ Error: ${blocksError.message}` : `✅ OK (${blocks?.length || 0} records)`}
        Bookings table: ${bookingsError ? `❌ Error: ${bookingsError.message}` : `✅ OK (${bookings?.length || 0} records)`}

        ${rulesError?.message?.includes('does not exist') ? '🚨 Run database_setup.sql in Supabase SQL editor!' : ''}
      `
    }
  } catch (err) {
    status = `❌ Database test failed: ${err instanceof Error ? err.message : 'Unknown error'}`
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre-line' }}>
      <h1>Database Connection Test</h1>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        {status}
      </div>
      <p style={{ marginTop: '20px' }}>
        <Link href="/" style={{ color: '#0066cc' }}>← Back to Home</Link>
      </p>
    </div>
  )
}