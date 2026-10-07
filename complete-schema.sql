-- Complete schema with PostGIS geometry support
-- Drop existing tables
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS theatre_bookings CASCADE;
DROP TABLE IF EXISTS emergency_requests CASCADE;
DROP TABLE IF EXISTS ambulances CASCADE;
DROP TABLE IF EXISTS theatres CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Users table with ALL fields from entity
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identity
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Profile
    name VARCHAR(255) NOT NULL,
    profile_picture_url VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    
    -- Role & Permissions
    role VARCHAR(50) NOT NULL DEFAULT 'patient',
    status VARCHAR(50) NOT NULL DEFAULT 'pending_verification',
    
    -- Location with PostGIS
    current_location GEOGRAPHY(POINT, 4326),
    latitude FLOAT,
    longitude FLOAT,
    location_updated_at TIMESTAMP,
    
    -- Medical Profile
    medical_conditions TEXT[],
    allergies TEXT[],
    emergency_contacts JSONB,
    insurance_info JSONB,
    
    -- Driver Profile
    driver_license_number VARCHAR(100),
    license_expiry_date DATE,
    certifications JSONB DEFAULT '[]'::jsonb,
    language VARCHAR(50),
    
    -- Notification
    notification_preferences JSONB,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    
    -- Security
    last_login_at TIMESTAMP,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- Hospitals table
CREATE TABLE hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'public',
    
    -- Location with PostGIS
    address JSONB NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    
    -- Contact
    contact_number VARCHAR(20),
    email VARCHAR(255),
    emergency_line VARCHAR(20),
    
    -- Capacity
    total_beds INTEGER DEFAULT 0,
    available_beds INTEGER DEFAULT 0,
    icu_beds INTEGER DEFAULT 0,
    available_icu_beds INTEGER DEFAULT 0,
    
    -- Services
    departments TEXT[],
    specialties TEXT[],
    facilities TEXT[],
    
    -- Operational
    has_emergency_dept BOOLEAN DEFAULT true,
    has_trauma_center BOOLEAN DEFAULT false,
    has_ambulance_service BOOLEAN DEFAULT false,
    trauma_level VARCHAR(10),
    
    -- Status
    is_operational BOOLEAN DEFAULT true,
    accepts_emergency BOOLEAN DEFAULT true,
    
    -- Ratings
    rating FLOAT DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Theatres table
CREATE TABLE theatres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    theatre_number VARCHAR(50),
    floor_level VARCHAR(50),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    
    -- Specifications
    specialties TEXT[],
    equipment JSONB DEFAULT '[]'::jsonb,
    capacity INTEGER DEFAULT 1,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    is_operational BOOLEAN DEFAULT true,
    
    -- Maintenance
    last_maintenance TIMESTAMP,
    next_maintenance TIMESTAMP,
    
    -- Stats
    total_procedures INTEGER DEFAULT 0,
    average_procedure_duration INTEGER DEFAULT 0,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Ambulances table  
CREATE TABLE ambulances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Vehicle Info
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    year INTEGER,
    vin VARCHAR(100),
    
    -- Assignment
    hospital_id UUID REFERENCES hospitals(id),
    current_driver_id UUID REFERENCES users(id),
    paramedics UUID[],
    
    -- Location & Tracking with PostGIS
    current_location GEOGRAPHY(POINT, 4326) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    heading FLOAT,
    speed FLOAT DEFAULT 0,
    location_history JSONB,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    available BOOLEAN DEFAULT true,
    
    -- Maintenance
    last_maintenance_date DATE,
    next_maintenance_due DATE,
    mileage INTEGER DEFAULT 0,
    
    -- Equipment & Supplies
    equipment JSONB DEFAULT '[]'::jsonb,
    medical_supplies JSONB DEFAULT '[]'::jsonb,
    
    -- Capabilities
    type VARCHAR(50) NOT NULL DEFAULT 'basic',
    capacity INTEGER DEFAULT 1,
    has_life_support BOOLEAN DEFAULT false,
    has_ventilator BOOLEAN DEFAULT false,
    has_defibrillator BOOLEAN DEFAULT true,
    has_incubator BOOLEAN DEFAULT false,
    
    -- Performance
    total_trips INTEGER DEFAULT 0,
    average_response_time INTEGER DEFAULT 0,
    rating FLOAT DEFAULT 0,
    
    -- Audit
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    "deletedAt" TIMESTAMP
);

-- Emergency Requests table
CREATE TABLE emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Patient Info
    patient_id UUID REFERENCES users(id),
    patient_name VARCHAR(255),
    patient_phone VARCHAR(20),
    
    -- Pickup Location with PostGIS
    pickup_location GEOGRAPHY(POINT, 4326) NOT NULL,
    pickup_latitude FLOAT NOT NULL,
    pickup_longitude FLOAT NOT NULL,
    pickup_address JSONB NOT NULL,
    
    -- Destination
    destination_hospital_id UUID REFERENCES hospitals(id),
    destination_location GEOGRAPHY(POINT, 4326),
    destination_latitude FLOAT,
    destination_longitude FLOAT,
    destination_address JSONB,
    
    -- Emergency Details
    emergency_type VARCHAR(100) NOT NULL,
    description TEXT,
    severity VARCHAR(50) NOT NULL DEFAULT 'medium',
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    
    -- Assignment
    assigned_ambulance_id UUID REFERENCES ambulances(id),
    assigned_driver_id UUID REFERENCES users(id),
    assigned_paramedics UUID[],
    
    -- Status & Timeline
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT NOW(),
    dispatched_at TIMESTAMP,
    arrived_at TIMESTAMP,
    picked_up_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    -- Performance
    response_time INTEGER,
    eta INTEGER,
    actual_duration INTEGER,
    distance_km FLOAT,
    
    -- Rating
    rating INTEGER,
    feedback TEXT,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Theatre Bookings table
CREATE TABLE theatre_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Booking Info
    theatre_id UUID NOT NULL REFERENCES theatres(id),
    hospital_id UUID NOT NULL REFERENCES hospitals(id),
    
    -- Patient & Medical Team
    patient_id UUID NOT NULL REFERENCES users(id),
    patient_name VARCHAR(255) NOT NULL,
    surgeon_id UUID REFERENCES users(id),
    anesthesiologist_id UUID REFERENCES users(id),
    nurses UUID[],
    
    -- Procedure Details
    procedure_name VARCHAR(255) NOT NULL,
    procedure_type VARCHAR(100),
    specialty VARCHAR(100),
    description TEXT,
    
    -- Scheduling
    scheduled_time TIMESTAMP NOT NULL,
    estimated_duration INTEGER NOT NULL,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    
    -- Requirements
    required_equipment JSONB,
    special_requirements TEXT,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    priority VARCHAR(50) DEFAULT 'normal',
    
    -- Patient Info
    patient_age INTEGER,
    patient_weight FLOAT,
    medical_history JSONB,
    allergies TEXT[],
    current_medications JSONB,
    
    -- Results
    outcome VARCHAR(100),
    complications TEXT,
    notes TEXT,
    
    -- Audit
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    deleted_at TIMESTAMP
);

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
    
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_location ON users USING GIST(current_location);

CREATE INDEX idx_hospitals_location ON hospitals USING GIST(location);
CREATE INDEX idx_hospitals_type ON hospitals(type);
CREATE INDEX idx_hospitals_operational ON hospitals(is_operational);

CREATE INDEX idx_theatres_hospital ON theatres(hospital_id);
CREATE INDEX idx_theatres_status ON theatres(status);

CREATE INDEX idx_ambulances_location ON ambulances USING GIST(current_location);
CREATE INDEX idx_ambulances_status ON ambulances(status);
CREATE INDEX idx_ambulances_hospital ON ambulances(hospital_id);
CREATE INDEX idx_ambulances_driver ON ambulances(current_driver_id);

CREATE INDEX idx_emergency_pickup_location ON emergency_requests USING GIST(pickup_location);
CREATE INDEX idx_emergency_status ON emergency_requests(status);
CREATE INDEX idx_emergency_patient ON emergency_requests(patient_id);
CREATE INDEX idx_emergency_ambulance ON emergency_requests(assigned_ambulance_id);

CREATE INDEX idx_bookings_theatre ON theatre_bookings(theatre_id);
CREATE INDEX idx_bookings_hospital ON theatre_bookings(hospital_id);
CREATE INDEX idx_bookings_patient ON theatre_bookings(patient_id);
CREATE INDEX idx_bookings_scheduled_time ON theatre_bookings(scheduled_time);
CREATE INDEX idx_bookings_status ON theatre_bookings(status);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Triggers to auto-update location from lat/lng
CREATE OR REPLACE FUNCTION update_user_location() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.current_location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_location_trigger BEFORE INSERT OR UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_user_location();

CREATE OR REPLACE FUNCTION update_hospital_location() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hospital_location_trigger BEFORE INSERT OR UPDATE ON hospitals
FOR EACH ROW EXECUTE FUNCTION update_hospital_location();

CREATE OR REPLACE FUNCTION update_ambulance_location() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.current_location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ambulance_location_trigger BEFORE INSERT OR UPDATE ON ambulances
FOR EACH ROW EXECUTE FUNCTION update_ambulance_location();

CREATE OR REPLACE FUNCTION update_emergency_pickup_location() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.pickup_latitude IS NOT NULL AND NEW.pickup_longitude IS NOT NULL THEN
        NEW.pickup_location = ST_SetSRID(ST_MakePoint(NEW.pickup_longitude, NEW.pickup_latitude), 4326)::geography;
    END IF;
    IF NEW.destination_latitude IS NOT NULL AND NEW.destination_longitude IS NOT NULL THEN
        NEW.destination_location = ST_SetSRID(ST_MakePoint(NEW.destination_longitude, NEW.destination_latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER emergency_location_trigger BEFORE INSERT OR UPDATE ON emergency_requests
FOR EACH ROW EXECUTE FUNCTION update_emergency_pickup_location();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
