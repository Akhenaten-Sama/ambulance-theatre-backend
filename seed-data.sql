-- Seed data for testing
-- Password for all users: Password123! (bcrypt hash)

-- Insert Users
INSERT INTO users (id, email, phone_number, password, name, role, status, gender, is_email_verified, is_phone_verified) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@hospital.com', '+2348012345678', '$2a$10$YourHashedPasswordHere', 'System Admin', 'system_admin', 'active', 'male', true, true),
('00000000-0000-0000-0000-000000000002', 'doctor@luth.gov.ng', '+2348034567890', '$2a$10$YourHashedPasswordHere', 'Dr. Amara Okonkwo', 'doctor', 'active', 'female', true, true),
('00000000-0000-0000-0000-000000000003', 'nurse@luth.gov.ng', '+2348045678901', '$2a$10$YourHashedPasswordHere', 'Nurse Chioma Eze', 'nurse', 'active', 'female', true, true),
('00000000-0000-0000-0000-000000000004', 'patient@gmail.com', '+2348056789012', '$2a$10$YourHashedPasswordHere', 'John Doe', 'patient', 'active', 'male', false, true),
('00000000-0000-0000-0000-000000000005', 'driver@luth.gov.ng', '+2348067890123', '$2a$10$YourHashedPasswordHere', 'Emeka Okafor', 'driver', 'active', 'male', true, true);

-- Insert Hospital
INSERT INTO hospitals (id, name, registration_number, phone_numbers, email, address, latitude, longitude, type, total_beds, available_beds, icu_beds, emergency_beds, has_emergency, has_icu, has_ambulance_service, specialties, doctors, nurses, rating, total_reviews) VALUES
('00000000-0000-0000-0000-000000000010', 
 'Lagos University Teaching Hospital (LUTH)', 
 'HOSP-NG-LUTH-001',
 ARRAY['+234-1-8723458'],
 'info@luth.gov.ng',
 '{"street":"Idi-Araba","city":"Surulere","state":"Lagos","country":"Nigeria","postal_code":"100001","full_address":"Idi-Araba, Surulere, Lagos"}'::jsonb,
 6.4969,
 3.3552,
 'teaching',
 750,
 520,
 50,
 100,
 true,
 true,
 true,
 ARRAY['cardiology', 'neurology'],
 ARRAY['00000000-0000-0000-0000-000000000002'],
 ARRAY['00000000-0000-0000-0000-000000000003'],
 4.5,
 1240
);

-- Insert Theatres
INSERT INTO theatres (id, hospital_id, name, type, specialty, specialties, status, floor, room_number, equipment, has_robotic_surgery, has_imaging, max_team_size, total_surgeries, average_turnover_time, utilization_rate) VALUES
('00000000-0000-0000-0000-000000000020',
 '00000000-0000-0000-0000-000000000010',
 'Main Operating Theatre 1',
 'general',
 'General Surgery',
 ARRAY['general_surgery'],
 'available',
 '2nd Floor',
 'OT-201',
 '[{"name":"Anesthesia Machine","quantity":1,"status":"available"},{"name":"Operating Table","quantity":1,"status":"available"}]'::jsonb,
 false,
 true,
 8,
 245,
 45,
 78.5
),
('00000000-0000-0000-0000-000000000021',
 '00000000-0000-0000-0000-000000000010',
 'Cardiothoracic Theatre',
 'cardiothoracic',
 'Cardiothoracic Surgery',
 ARRAY['cardiology'],
 'available',
 '3rd Floor',
 'OT-301',
 '[{"name":"Heart-Lung Machine","quantity":1,"status":"available"}]'::jsonb,
 true,
 true,
 12,
 120,
 90,
 65.0
);

-- Insert Ambulance
INSERT INTO ambulances (id, vehicle_number, vehicle_make, vehicle_model, year, vin, hospital_id, current_driver_id, type, status, latitude, longitude, available, has_life_support, capacity, equipment, medical_supplies, mileage, paramedics) VALUES
('00000000-0000-0000-0000-000000000030',
 'AMB-LG-001',
 'Mercedes-Benz',
 'Sprinter',
 2022,
 'WDB9066651K123456',
 '00000000-0000-0000-0000-000000000010',
 '00000000-0000-0000-0000-000000000005',
 'als',
 'available',
 6.5244,
 3.3792,
 true,
 true,
 2,
 '[{"name":"Defibrillator","quantity":1,"status":"available"},{"name":"Ventilator","quantity":1,"status":"available"}]'::jsonb,
 '[{"name":"Bandages","quantity":50,"unit":"pcs"},{"name":"IV Fluids","quantity":10,"unit":"bags"}]'::jsonb,
 8452.3,
 ARRAY[]::text[]
);

-- Verify data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Hospitals', COUNT(*) FROM hospitals
UNION ALL
SELECT 'Theatres', COUNT(*) FROM theatres
UNION ALL
SELECT 'Ambulances', COUNT(*) FROM ambulances;
