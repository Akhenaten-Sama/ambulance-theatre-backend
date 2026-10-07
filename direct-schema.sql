-- Direct SQL Schema - Bypass TypeORM synchronize issues
-- Drop existing tables if any
DROP TABLE IF EXISTS emergency_requests CASCADE;
DROP TABLE IF EXISTS theatre_bookings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ambulances CASCADE;
DROP TABLE IF EXISTS theatres CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    gender VARCHAR(20),
    date_of_birth DATE,
    blood_group VARCHAR(10),
    driver_license_number VARCHAR(100),
    license_expiry_date DATE,
    certifications JSONB DEFAULT '[]',
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Hospitals table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    phone_numbers TEXT[] NOT NULL,
    email VARCHAR(255),
    website VARCHAR(255),
    address JSONB NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location GEOMETRY(Point, 4326),
    type VARCHAR(50) NOT NULL,
    total_beds INTEGER DEFAULT 0,
    available_beds INTEGER DEFAULT 0,
    icu_beds INTEGER DEFAULT 0,
    emergency_beds INTEGER DEFAULT 0,
    has_emergency BOOLEAN DEFAULT false,
    has_icu BOOLEAN DEFAULT false,
    has_ambulance_service BOOLEAN DEFAULT false,
    departments JSONB DEFAULT '[]',
    specialties TEXT[] DEFAULT '{}',
    doctors TEXT[] DEFAULT '{}',
    nurses TEXT[] DEFAULT '{}',
    admin_staff TEXT[] DEFAULT '{}',
    accreditations JSONB DEFAULT '[]',
    operating_hours JSONB,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_hospitals_location ON hospitals USING GIST(location);
CREATE INDEX idx_hospitals_type ON hospitals(type);
CREATE INDEX idx_hospitals_status ON hospitals(status);

-- Theatres table
CREATE TABLE theatres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    floor VARCHAR(50),
    room_number VARCHAR(50),
    type VARCHAR(50) NOT NULL,
    specialties TEXT[] DEFAULT '{}',
    specialty VARCHAR(255),
    equipment JSONB DEFAULT '[]',
    has_robotic_surgery BOOLEAN DEFAULT false,
    has_imaging BOOLEAN DEFAULT false,
    has_hybrid_capabilities BOOLEAN DEFAULT false,
    max_team_size INTEGER DEFAULT 0,
    sterility_class VARCHAR(50),
    status VARCHAR(50) DEFAULT 'available',
    current_surgery_id VARCHAR(255),
    current_surgeon_id VARCHAR(255),
    total_surgeries INTEGER DEFAULT 0,
    average_turnover_time INTEGER DEFAULT 0,
    utilization_rate DECIMAL(5, 2) DEFAULT 0,
    last_sterilization TIMESTAMP,
    next_maintenance TIMESTAMP,
    maintenance_schedule JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_theatres_hospital ON theatres(hospital_id);
CREATE INDEX idx_theatres_status ON theatres(status);
CREATE INDEX idx_theatres_type ON theatres(type);

-- Ambulances table
CREATE TABLE ambulances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_make VARCHAR(100) NOT NULL,
    vehicle_model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    vin VARCHAR(100),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    current_driver_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOMETRY(Point, 4326),
    current_location JSONB,
    location_history JSONB DEFAULT '[]',
    available BOOLEAN DEFAULT true,
    has_life_support BOOLEAN DEFAULT false,
    capacity INTEGER DEFAULT 1,
    equipment JSONB DEFAULT '[]',
    medical_supplies JSONB DEFAULT '[]',
    fuel_level DECIMAL(5, 2) DEFAULT 100,
    mileage DECIMAL(10, 2) DEFAULT 0,
    last_service_date DATE,
    next_service_date DATE,
    paramedics TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_ambulances_hospital ON ambulances(hospital_id);
CREATE INDEX idx_ambulances_status ON ambulances(status);
CREATE INDEX idx_ambulances_location ON ambulances USING GIST(location);
CREATE INDEX idx_ambulances_driver ON ambulances(current_driver_id);

-- Emergency Requests table
CREATE TABLE emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id),
    ambulance_id UUID REFERENCES ambulances(id),
    hospital_id UUID REFERENCES hospitals(id),
    pickup_latitude DECIMAL(10, 8) NOT NULL,
    pickup_longitude DECIMAL(11, 8) NOT NULL,
    pickup_location GEOMETRY(Point, 4326),
    pickup_address JSONB,
    destination_latitude DECIMAL(10, 8),
    destination_longitude DECIMAL(11, 8),
    destination_location GEOMETRY(Point, 4326),
    emergency_type VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    description TEXT NOT NULL,
    patient_name VARCHAR(255),
    patient_phone VARCHAR(20),
    patient_condition TEXT,
    vital_signs JSONB,
    estimated_arrival_time TIMESTAMP,
    actual_arrival_time TIMESTAMP,
    completion_time TIMESTAMP,
    distance_km DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_emergency_requests_patient ON emergency_requests(patient_id);
CREATE INDEX idx_emergency_requests_ambulance ON emergency_requests(ambulance_id);
CREATE INDEX idx_emergency_requests_status ON emergency_requests(status);
CREATE INDEX idx_emergency_requests_pickup ON emergency_requests USING GIST(pickup_location);

-- Theatre Bookings table
CREATE TABLE theatre_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    theatre_id UUID NOT NULL REFERENCES theatres(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES users(id),
    surgeon_id UUID REFERENCES users(id),
    surgery_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    patient_name VARCHAR(255),
    patient_phone VARCHAR(20),
    medical_condition TEXT,
    priority VARCHAR(50),
    anesthesia_type VARCHAR(100),
    estimated_duration INTEGER,
    team_members JSONB DEFAULT '[]',
    required_equipment JSONB DEFAULT '[]',
    pre_op_notes TEXT,
    post_op_notes TEXT,
    complications TEXT,
    outcome VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE INDEX idx_theatre_bookings_theatre ON theatre_bookings(theatre_id);
CREATE INDEX idx_theatre_bookings_hospital ON theatre_bookings(hospital_id);
CREATE INDEX idx_theatre_bookings_status ON theatre_bookings(status);
CREATE INDEX idx_theatre_bookings_scheduled ON theatre_bookings(scheduled_start, scheduled_end);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    priority VARCHAR(50) DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Update geometry columns from lat/lng
CREATE OR REPLACE FUNCTION update_location_from_coordinates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating geometry columns
CREATE TRIGGER hospitals_location_trigger
    BEFORE INSERT OR UPDATE ON hospitals
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_coordinates();

CREATE TRIGGER ambulances_location_trigger
    BEFORE INSERT OR UPDATE ON ambulances
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_coordinates();

CREATE TRIGGER emergency_requests_pickup_trigger
    BEFORE INSERT OR UPDATE ON emergency_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_location_from_coordinates();

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
