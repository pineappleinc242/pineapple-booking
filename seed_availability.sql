-- Insert default availability rules for weekdays (Monday-Friday, 9 AM - 5 PM)
INSERT INTO public.availability_rules (day_of_week, start_time, end_time, slot_minutes, enabled) VALUES
(1, '09:00', '17:00', 60, true), -- Monday
(2, '09:00', '17:00', 60, true), -- Tuesday
(3, '09:00', '17:00', 60, true), -- Wednesday
(4, '09:00', '17:00', 60, true), -- Thursday
(5, '09:00', '17:00', 60, true); -- Friday

-- Insert weekend availability (Saturday-Sunday, 10 AM - 4 PM)
INSERT INTO public.availability_rules (day_of_week, start_time, end_time, slot_minutes, enabled) VALUES
(6, '10:00', '16:00', 60, true), -- Saturday
(0, '10:00', '16:00', 60, true); -- Sunday