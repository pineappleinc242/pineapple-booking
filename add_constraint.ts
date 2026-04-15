import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('Adding unique constraint to prevent duplicate bookings...')

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'add_booking_constraint.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Since we can't directly execute DDL through the client, let's print the SQL
    console.log('Please run the following SQL in your Supabase SQL Editor:')
    console.log('='.repeat(50))
    console.log(sql)
    console.log('='.repeat(50))
    console.log('This will prevent duplicate bookings for the same service and time.')

  } catch (err) {
    console.error('Error reading SQL file:', err)
    process.exit(1)
  }
}

runMigration()