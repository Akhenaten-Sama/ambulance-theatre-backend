-- Comprehensive seed data with proper PostGIS geography

-- Insert users with locations
INSERT INTO users (id, email, phone_number, password, name, role, status, latitude, longitude, certifications, is_email_verified, is_phone_verified)
VALUES 
    -- Admin
    ('00000000-0000-0000-0000-000000000001', 'admin@hospital.com', '+2348012345601', '$2a$10$YourHashedPasswordHere', 'Admin User', 'admin', 'active', 6.5244, 3.3792, '[]'::jsonb, true, true),
    
    -- Doctor
    ('00000000-0000-0000-0000-000000000002', 'doctor@luth.gov.ng', '+2348012345602', '$2a$10$YourHashedPasswordHere', 'Dr. Adebayo Johnson', 'doctor', 'active', 6.4969, 3.3552, '[{"name": "MBBS", "issuer": "University of Lagos"}, {"name": "FWACS", "issuer": "West African College of Surgeons"}]'::jsonb, true, true),
    
    -- Nurse
    ('00000000-0000-0000-0000-000000000003', 'nurse@luth.gov.ng', '+2348012345603', '$2a$10$YourHashedPasswordHere', 'Nurse Amina Mohammed', 'nurse', 'active', 6.4975, 3.3560, '[{"name": "RN", "issuer": "Nursing Council of Nigeria"}]'::jsonb, true, true),
    
    -- Ambulance Driver
    ('00000000-0000-0000-0000-000000000004', 'driver@luth.gov.ng', '+2348012345604', '$2a$10$YourHashedPasswordHere', 'Chukwudi Okafor', 'driver', 'active', 6.4980, 3.3565, '[{"name": "Ambulance Driver License", "issuer": "LASG"}]'::jsonb, true, true),
    
    -- Patient
    ('00000000-0000-0000-0000-000000000005', 'patient@gmail.com', '+2348012345605', '$2a$10$YourHashedPasswordHere', 'Funmi Oladipo', 'patient', 'active', 6.6018, 3.3515, '[]'::jsonb, true, true),
    
    -- More patients
    ('00000000-0000-0000-0000-000000000006', 'patient2@gmail.com', '+2348012345606', '$2a$10$YourHashedPasswordHere', 'Ibrahim Bello', 'patient', 'active', 6.4541, 3.3947, '[]'::jsonb, true, true),
    ('00000000-0000-0000-0000-000000000007', 'patient3@gmail.com', '+2348012345607', '$2a$10$YourHashedPasswordHere', 'Ngozi Okeke', 'patient', 'active', 6.6052, 3.3495, '[]'::jsonb, true, true),
    
    -- Paramedic
    ('00000000-0000-0000-0000-000000000008', 'paramedic@luth.gov.ng', '+2348012345608', '$2a$10$YourHashedPasswordHere', 'Emmanuel Adewale', 'paramedic', 'active', 6.4985, 3.3570, '[{"name": "EMT-Basic", "issuer": "Red Cross Nigeria"}]'::jsonb, true, true),
    
    -- Another driver
    ('00000000-0000-0000-0000-000000000009', 'driver2@luth.gov.ng', '+2348012345609', '$2a$10$YourHashedPasswordHere', 'Mohammed Abubakar', 'driver', 'active', 6.5100, 3.3600, '[{"name": "Ambulance Driver License", "issuer": "LASG"}]'::jsonb, true, true),
    
    -- Surgeon
    ('00000000-0000-0000-0000-000000000010', 'surgeon@luth.gov.ng', '+2348012345610', '$2a$10$YourHashedPasswordHere', 'Dr. Oluwaseun Williams', 'doctor', 'active', 6.4970, 3.3555, '[{"name": "MBBS", "issuer": "University of Ibadan"}, {"name": "FMCS", "issuer": "National Postgraduate Medical College"}]'::jsonb, true, true);

-- Insert hospitals with locations
INSERT INTO hospitals (id, name, type, address, latitude, longitude, contact_number, email, emergency_line, total_beds, available_beds, icu_beds, available_icu_beds, departments, specialties, facilities, has_emergency_dept, has_trauma_center, has_ambulance_service, trauma_level, accepts_emergency)
VALUES 
    (
        '10000000-0000-0000-0000-000000000001',
        'Lagos University Teaching Hospital (LUTH)',
        'public',
        '{"street": "Idi-Araba", "city": "Lagos", "state": "Lagos", "country": "Nigeria", "postalCode": "100254"}'::jsonb,
        6.4969, 3.3552,
        '+2348012340001',
        'info@luth.gov.ng',
        '+2348012340199',
        800, 120, 50, 8,
        ARRAY['Emergency', 'Surgery', 'Pediatrics', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
        ARRAY['Cardiothoracic Surgery', 'Neurosurgery', 'Trauma Care', 'Emergency Medicine', 'Pediatric Surgery'],
        ARRAY['CT Scan', 'MRI', 'X-Ray', 'Ultrasound', 'Laboratory', 'Blood Bank', 'Pharmacy'],
        true, true, true, 'Level 1', true
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        'Ikeja General Hospital',
        'public',
        '{"street": "Harvey Road", "city": "Ikeja", "state": "Lagos", "country": "Nigeria", "postalCode": "100211"}'::jsonb,
        6.6018, 3.3515,
        '+2348012340002',
        'info@ikejageneral.gov.ng',
        '+2348012340299',
        400, 80, 20, 5,
        ARRAY['Emergency', 'Surgery', 'Obstetrics', 'Pediatrics', 'Internal Medicine'],
        ARRAY['General Surgery', 'Obstetrics & Gynecology', 'Emergency Medicine'],
        ARRAY['X-Ray', 'Ultrasound', 'Laboratory', 'Pharmacy'],
        true, false, true, 'Level 2', true
    ),
    (
        '10000000-0000-0000-0000-000000000003',
        'Gbagada General Hospital',
        'public',
        '{"street": "Hospital Road", "city": "Gbagada", "state": "Lagos", "country": "Nigeria", "postalCode": "100242"}'::jsonb,
        6.5447, 3.3908,
        '+2348012340003',
        'info@gbagadageneral.gov.ng',
        '+2348012340399',
        300, 60, 15, 3,
        ARRAY['Emergency', 'Surgery', 'Pediatrics', 'Obstetrics'],
        ARRAY['General Surgery', 'Emergency Medicine', 'Maternity Care'],
        ARRAY['X-Ray', 'Laboratory', 'Pharmacy'],
        true, false, false, null, true
    );

-- Insert theatres
INSERT INTO theatres (id, name, theatre_number, floor_level, hospital_id, specialties, equipment, capacity, status)
VALUES 
    (
        '20000000-0000-0000-0000-000000000001',
        'Main Operating Theatre',
        'OT-1',
        '3rd Floor',
        '10000000-0000-0000-0000-000000000001',
        ARRAY['General Surgery', 'Orthopedics', 'Neurosurgery'],
        '[
            {"name": "Anesthesia Machine", "quantity": 1, "status": "available"},
            {"name": "Operating Table", "quantity": 1, "status": "available"},
            {"name": "Surgical Lights", "quantity": 2, "status": "available"},
            {"name": "Electrosurgical Unit", "quantity": 1, "status": "available"},
            {"name": "Defibrillator", "quantity": 1, "status": "available"},
            {"name": "Patient Monitor", "quantity": 2, "status": "available"}
        ]'::jsonb,
        1, 'available'
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        'Cardiothoracic Theatre',
        'OT-2',
        '3rd Floor',
        '10000000-0000-0000-0000-000000000001',
        ARRAY['Cardiothoracic Surgery', 'Cardiac Surgery'],
        '[
            {"name": "Heart-Lung Machine", "quantity": 1, "status": "available"},
            {"name": "Anesthesia Machine", "quantity": 1, "status": "available"},
            {"name": "Operating Table", "quantity": 1, "status": "available"},
            {"name": "Surgical Lights", "quantity": 2, "status": "available"},
            {"name": "Defibrillator", "quantity": 1, "status": "available"},
            {"name": "ECMO Machine", "quantity": 1, "status": "available"}
        ]'::jsonb,
        1, 'available'
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        'Emergency Theatre',
        'OT-E1',
        '2nd Floor',
        '10000000-0000-0000-0000-000000000001',
        ARRAY['Trauma Surgery', 'Emergency Surgery'],
        '[
            {"name": "Anesthesia Machine", "quantity": 1, "status": "available"},
            {"name": "Operating Table", "quantity": 1, "status": "available"},
            {"name": "Surgical Lights", "quantity": 2, "status": "available"},
            {"name": "Defibrillator", "quantity": 1, "status": "available"}
        ]'::jsonb,
        1, 'available'
    ),
    (
        '20000000-0000-0000-0000-000000000004',
        'General Theatre',
        'OT-1',
        '2nd Floor',
        '10000000-0000-0000-0000-000000000002',
        ARRAY['General Surgery', 'Obstetrics'],
        '[
            {"name": "Anesthesia Machine", "quantity": 1, "status": "available"},
            {"name": "Operating Table", "quantity": 1, "status": "available"},
            {"name": "Surgical Lights", "quantity": 2, "status": "available"}
        ]'::jsonb,
        1, 'available'
    );

-- Insert ambulances with locations
INSERT INTO ambulances (id, vehicle_number, vehicle_make, vehicle_model, year, vin, hospital_id, current_driver_id, paramedics, latitude, longitude, status, type, capacity, has_life_support, has_defibrillator, has_ventilator, equipment, medical_supplies)
VALUES 
    (
        '30000000-0000-0000-0000-000000000001',
        'AMB-LG-001',
        'Mercedes-Benz',
        'Sprinter 319CDI',
        2022,
        'WDB9066331N123456',
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000004',
        ARRAY['00000000-0000-0000-0000-000000000008']::uuid[],
        6.4969, 3.3552,
        'available',
        'als',
        2,
        true, true, true,
        '[
            {"name": "Stretcher", "quantity": 1, "status": "available"},
            {"name": "Defibrillator", "quantity": 1, "status": "available"},
            {"name": "Oxygen Cylinder", "quantity": 2, "status": "available"},
            {"name": "Ventilator", "quantity": 1, "status": "available"},
            {"name": "Suction Device", "quantity": 1, "status": "available"},
            {"name": "Spine Board", "quantity": 1, "status": "available"}
        ]'::jsonb,
        '[
            {"name": "IV Fluids", "quantity": 10, "status": "available"},
            {"name": "Bandages", "quantity": 50, "status": "available"},
            {"name": "Epinephrine", "quantity": 5, "status": "available"},
            {"name": "Aspirin", "quantity": 20, "status": "available"}
        ]'::jsonb
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        'AMB-LG-002',
        'Toyota',
        'Hiace Ambulance',
        2021,
        'JTNB16LE20J123457',
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000009',
        ARRAY[]::uuid[],
        6.5100, 3.3600,
        'available',
        'bls',
        1,
        false, true, false,
        '[
            {"name": "Stretcher", "quantity": 1, "status": "available"},
            {"name": "Defibrillator", "quantity": 1, "status": "available"},
            {"name": "Oxygen Cylinder", "quantity": 2, "status": "available"},
            {"name": "First Aid Kit", "quantity": 1, "status": "available"}
        ]'::jsonb,
        '[
            {"name": "Bandages", "quantity": 30, "status": "available"},
            {"name": "Gauze", "quantity": 20, "status": "available"}
        ]'::jsonb
    ),
    (
        '30000000-0000-0000-0000-000000000003',
        'AMB-IK-001',
        'Ford',
        'Transit Ambulance',
        2023,
        'WF0TXXBCGTKF12345',
        '10000000-0000-0000-0000-000000000002',
        NULL,
        ARRAY[]::uuid[],
        6.6018, 3.3515,
        'available',
        'bls',
        1,
        false, true, false,
        '[
            {"name": "Stretcher", "quantity": 1, "status": "available"},
            {"name": "Defibrillator", "quantity": 1, "status": "available"},
            {"name": "Oxygen Cylinder", "quantity": 2, "status": "available"}
        ]'::jsonb,
        '[]'::jsonb
    );

-- Insert sample emergency request (completed)
INSERT INTO emergency_requests (id, patient_id, patient_name, patient_phone, pickup_latitude, pickup_longitude, pickup_address, destination_hospital_id, emergency_type, severity, priority, assigned_ambulance_id, assigned_driver_id, assigned_paramedics, status, requested_at, dispatched_at, arrived_at, picked_up_at, completed_at, response_time, actual_duration, distance_km, rating, feedback)
VALUES 
    (
        '40000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000005',
        'Funmi Oladipo',
        '+2348012345605',
        6.6052, 3.3495,
        '{"street": "Allen Avenue", "city": "Ikeja", "state": "Lagos", "country": "Nigeria"}'::jsonb,
        '10000000-0000-0000-0000-000000000001',
        'Accident',
        'high',
        'high',
        '30000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000004',
        ARRAY['00000000-0000-0000-0000-000000000008']::uuid[],
        'completed',
        NOW() - INTERVAL '2 hours',
        NOW() - INTERVAL '1 hour 55 minutes',
        NOW() - INTERVAL '1 hour 40 minutes',
        NOW() - INTERVAL '1 hour 35 minutes',
        NOW() - INTERVAL '1 hour',
        15, 60, 12.5, 5, 'Excellent service, very professional!'
    );

-- Insert sample theatre booking (upcoming)
INSERT INTO theatre_bookings (id, theatre_id, hospital_id, patient_id, patient_name, surgeon_id, procedure_name, procedure_type, specialty, scheduled_time, estimated_duration, status, priority, patient_age, description)
VALUES 
    (
        '50000000-0000-0000-0000-000000000001',
        '20000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000006',
        'Ibrahim Bello',
        '00000000-0000-0000-0000-000000000010',
        'Appendectomy',
        'Laparoscopic',
        'General Surgery',
        NOW() + INTERVAL '2 days',
        90,
        'scheduled',
        'normal',
        35,
        'Laparoscopic appendectomy for acute appendicitis'
    ),
    (
        '50000000-0000-0000-0000-000000000002',
        '20000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000007',
        'Ngozi Okeke',
        '00000000-0000-0000-0000-000000000002',
        'Coronary Artery Bypass Grafting',
        'Open Heart Surgery',
        'Cardiothoracic Surgery',
        NOW() + INTERVAL '5 days',
        300,
        'scheduled',
        'high',
        62,
        'CABG for coronary artery disease'
    );

-- Verify data
SELECT 'Users:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Hospitals:', COUNT(*) FROM hospitals
UNION ALL
SELECT 'Theatres:', COUNT(*) FROM theatres
UNION ALL
SELECT 'Ambulances:', COUNT(*) FROM ambulances
UNION ALL
SELECT 'Emergency Requests:', COUNT(*) FROM emergency_requests
UNION ALL
SELECT 'Theatre Bookings:', COUNT(*) FROM theatre_bookings;
