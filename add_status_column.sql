-- Add status column to bookings table
ALTER TABLE bookings ADD COLUMN status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed'));

-- Update existing bookings to have confirmed status (they were all confirmed)
UPDATE bookings SET status = 'confirmed' WHERE status IS NULL;