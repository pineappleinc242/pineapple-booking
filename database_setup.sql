-- Create availability_rules table
CREATE TABLE public.availability_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week int NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time text NOT NULL,
    end_time text NOT NULL,
    slot_minutes int NOT NULL DEFAULT 60,
    enabled boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create availability_blocks table
CREATE TABLE public.availability_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    block_date date NOT NULL,
    start_time text NOT NULL,
    end_time text NOT NULL,
    reason text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Create bookings table with proper UTC timestamp
CREATE TABLE public.bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    service text NOT NULL,
    booking_datetime timestamptz NOT NULL, -- UTC timestamp
    notes text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_availability_rules_day_enabled ON public.availability_rules(day_of_week, enabled);
CREATE INDEX idx_availability_blocks_date ON public.availability_blocks(block_date);
CREATE INDEX idx_bookings_datetime ON public.bookings(booking_datetime);
CREATE INDEX idx_bookings_service_datetime ON public.bookings(service, booking_datetime);

-- Enable RLS (Row Level Security)
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies (allow service role full access)
CREATE POLICY "Service role can manage availability_rules" ON public.availability_rules
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage availability_blocks" ON public.availability_blocks
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage bookings" ON public.bookings
    FOR ALL USING (auth.role() = 'service_role');