-- Add unique constraint to prevent duplicate bookings
-- This ensures no two bookings can exist for the same service at the same time

ALTER TABLE public.bookings
ADD CONSTRAINT unique_service_date_time
UNIQUE (service, booking_date, booking_time);