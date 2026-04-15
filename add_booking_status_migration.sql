-- Add booking status and reschedule tracking columns
-- Run this migration to add admin booking actions support

-- Add status column with default 'PENDING'
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'APPROVED', 'CANCELLED', 'RESCHEDULED'));

-- Add reschedule tracking columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rescheduled_from_date DATE NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS rescheduled_from_time TEXT NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Create index on booking_date for admin list performance
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON bookings(booking_date, status);

-- Update existing bookings to have APPROVED status (they were previously confirmed)
UPDATE bookings SET status = 'APPROVED' WHERE status = 'PENDING' OR status IS NULL;

-- Update the updated_at for existing records
UPDATE bookings SET updated_at = created_at WHERE updated_at = created_at;