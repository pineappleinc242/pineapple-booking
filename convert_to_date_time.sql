-- Convert bookings table from booking_datetime to booking_date/booking_time

-- Add the separate date and time columns
ALTER TABLE public.bookings ADD COLUMN booking_date date;
ALTER TABLE public.bookings ADD COLUMN booking_time text;

-- For existing bookings with booking_datetime, extract date and time
-- Convert UTC timestamp to local date/time for storage
UPDATE public.bookings
SET
  booking_date = (booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE '+11')::date,
  booking_time = to_char((booking_datetime AT TIME ZONE 'UTC' AT TIME ZONE '+11'), 'HH24:MI')
WHERE booking_datetime IS NOT NULL;

-- Make the new columns NOT NULL
ALTER TABLE public.bookings ALTER COLUMN booking_date SET NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN booking_time SET NOT NULL;

-- Drop the old booking_datetime column
ALTER TABLE public.bookings DROP COLUMN booking_datetime;

-- Add the new index
CREATE INDEX idx_bookings_service_date_time ON public.bookings(service, booking_date, booking_time);

-- Enable RLS and create policy (skip if already exists)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage bookings" ON public.bookings;
CREATE POLICY "Service role can manage bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role');