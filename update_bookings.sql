-- SQL to update existing bookings table to UTC timestamp format

-- Step 1: Add the new booking_datetime column
ALTER TABLE public.bookings ADD COLUMN booking_datetime timestamptz;

-- Step 2: Migrate existing data (AEDT timezone = UTC+11)
-- Convert 12-hour format times to 24-hour format and create timestamps
UPDATE public.bookings
SET booking_datetime = (
  booking_date::text || 'T' ||
  -- Extract hour and minute, convert to 24-hour format
  CASE
    WHEN split_part(booking_time, ' ', 2) = 'AM' AND split_part(booking_time, ':', 1)::int = 12 THEN
      '00:' || split_part(split_part(booking_time, ':', 2), ' ', 1) || ':00+11:00'
    WHEN split_part(booking_time, ' ', 2) = 'AM' THEN
      lpad(split_part(booking_time, ':', 1), 2, '0') || ':' || split_part(split_part(booking_time, ':', 2), ' ', 1) || ':00+11:00'
    WHEN split_part(booking_time, ' ', 2) = 'PM' AND split_part(booking_time, ':', 1)::int = 12 THEN
      '12:' || split_part(split_part(booking_time, ':', 2), ' ', 1) || ':00+11:00'
    WHEN split_part(booking_time, ' ', 2) = 'PM' THEN
      (12 + split_part(booking_time, ':', 1)::int)::text || ':' || split_part(split_part(booking_time, ':', 2), ' ', 1) || ':00+11:00'
    ELSE '00:00:00+11:00'
  END
)::timestamptz
WHERE booking_datetime IS NULL;-- Step 3: Make the column NOT NULL after migration
ALTER TABLE public.bookings ALTER COLUMN booking_datetime SET NOT NULL;

-- Step 4: Drop old columns
ALTER TABLE public.bookings DROP COLUMN booking_date;
ALTER TABLE public.bookings DROP COLUMN booking_time;

-- Step 5: Add the new index
CREATE INDEX idx_bookings_service_datetime ON public.bookings(service, booking_datetime);

-- Step 6: Enable RLS and create policy (if not already done)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role');
