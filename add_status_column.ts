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
    console.log('Adding status column to bookings table...')

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'add_status_column.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0)

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...')
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' })

        if (error) {
          // If rpc doesn't work, try direct query
          console.log('Trying direct query...')
          const { error: directError } = await supabase.from('bookings').select('*').limit(1)
          if (directError && directError.message.includes('status')) {
            console.log('Status column might already exist, skipping...')
            continue
          }

          console.error('Error executing statement:', error)
          console.log('Please run the following SQL manually in your Supabase SQL Editor:')
          console.log('='.repeat(50))
          console.log(sql)
          console.log('='.repeat(50))
          return
        }
      }
    }

    console.log('✅ Status column migration completed successfully!')

  } catch (err) {
    console.error('Error running migration:', err)
    console.log('Please run the following SQL manually in your Supabase SQL Editor:')
    console.log('='.repeat(50))
    console.log(fs.readFileSync(path.join(process.cwd(), 'add_status_column.sql'), 'utf8'))
    console.log('='.repeat(50))
  }
}

runMigration()