# Ambulance & Theatre Management System - Technical Specification v2.0
**State-of-the-Art Healthcare Resource Management Platform**

---

## Executive Summary

### Project Overview
The Ambulance & Theatre Management System is a comprehensive healthcare resource optimization platform designed to connect patients with emergency ambulance services and available operating theatre facilities in real-time. The system addresses critical healthcare logistics challenges by providing intelligent resource allocation, real-time tracking, and seamless coordination between patients, medical staff, and healthcare facilities.

### Problem Statement
Current healthcare systems face:
- **Inefficient Emergency Response**: Patients struggle to locate nearby available ambulances during emergencies
- **Theatre Booking Chaos**: No centralized system to track operating theatre availability across multiple hospitals
- **Resource Underutilization**: Poor visibility into available medical resources leads to inefficient allocation
- **Communication Gaps**: Lack of real-time coordination between patients, drivers, hospitals, and medical staff
- **Data-Driven Insights Deficit**: Limited analytics for optimizing resource deployment and service improvement

### Solution
A cloud-native, microservices-based platform that provides:
- Real-time ambulance tracking and dispatch
- Intelligent operating theatre scheduling and availability management
- Multi-tenant hospital management
- Advanced geospatial search and routing
- Real-time notifications and communication
- Comprehensive analytics and reporting
- Mobile-first responsive design

---

## System Architecture

### Architecture Pattern
**Event-Driven Microservices Architecture** with CQRS (Command Query Responsibility Segregation) for scalability and performance.

### Technology Stack

#### Backend Core
- **Runtime**: Node.js 20+ LTS
- **Framework**: NestJS 11+ (TypeScript-first, modular architecture)
- **Language**: TypeScript 5.7+
- **API Style**: RESTful + GraphQL (hybrid approach)
- **Real-time**: WebSocket (Socket.io) + Server-Sent Events (SSE)

#### Data Layer
- **Primary Database**: PostgreSQL 16+ with PostGIS extension (geospatial queries)
- **Cache Layer**: Redis 7+ (session management, real-time data, rate limiting)
- **Search Engine**: Elasticsearch 8+ (full-text search, analytics)
- **Message Queue**: BullMQ (Redis-based) + Apache Kafka (event streaming)
- **Time-Series DB**: TimescaleDB (location tracking, metrics)

#### Infrastructure & DevOps
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (EKS/GKE/AKS)
- **CI/CD**: GitHub Actions / GitLab CI
- **API Gateway**: Kong / AWS API Gateway
- **Service Mesh**: Istio (for production microservices)
- **Monitoring**: Prometheus + Grafana + ELK Stack
- **APM**: DataDog / New Relic / OpenTelemetry
- **Error Tracking**: Sentry

#### External Services
- **Maps & Routing**: Google Maps API / Mapbox
- **SMS/Voice**: Twilio / AWS SNS
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Email**: SendGrid / AWS SES
- **File Storage**: AWS S3 / MinIO
- **CDN**: CloudFlare / AWS CloudFront

#### Security & Compliance
- **Authentication**: OAuth 2.0 + OpenID Connect
- **Authorization**: RBAC (Role-Based Access Control) + ABAC (Attribute-Based)
- **Identity Management**: Auth0 / Keycloak / AWS Cognito
- **Secrets Management**: HashiCorp Vault / AWS Secrets Manager
- **API Security**: Rate limiting, API keys, JWT tokens
- **Encryption**: TLS 1.3, AES-256, bcrypt
- **Compliance**: HIPAA, GDPR, SOC 2

---

## Domain Model & Entities

### Core Entities

#### 1. User (Enhanced)
```typescript
interface User {
  id: UUID;
  
  // Identity
  email: string;                    // Unique, indexed
  phone_number: string;             // Unique, indexed, E.164 format
  password_hash: string;
  
  // Profile
  name: string;
  profile_picture_url?: string;
  date_of_birth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  blood_group?: BloodGroup;
  
  // Role & Permissions
  role: UserRole;                   // Enum: PATIENT, DRIVER, PARAMEDIC, DOCTOR, NURSE, ADMIN, SUPER_ADMIN
  permissions: Permission[];
  status: UserStatus;               // ACTIVE, SUSPENDED, INACTIVE, PENDING_VERIFICATION
  
  // Location
  current_location?: GeoPoint;
  last_known_location?: GeoPoint;
  location_updated_at?: Timestamp;
  
  // Medical Profile (for patients)
  medical_conditions?: string[];
  allergies?: string[];
  emergency_contacts?: EmergencyContact[];
  insurance_info?: InsuranceInfo;
  
  // Driver Profile
  driver_license_number?: string;
  license_expiry_date?: Date;
  certifications?: Certification[];
  
  // Preferences
  language: string;                 // Default: 'en'
  notification_preferences: NotificationPreferences;
  
  // Metadata
  is_verified: boolean;
  verification_token?: string;
  password_reset_token?: string;
  password_reset_expires?: Timestamp;
  last_login_at?: Timestamp;
  failed_login_attempts: number;
  account_locked_until?: Timestamp;
  
  // Audit
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at?: Timestamp;           // Soft delete
  created_by?: UUID;
  updated_by?: UUID;
}

enum UserRole {
  PATIENT = 'patient',
  DRIVER = 'driver',
  PARAMEDIC = 'paramedic',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  HOSPITAL_ADMIN = 'hospital_admin',
  SYSTEM_ADMIN = 'system_admin',
  SUPER_ADMIN = 'super_admin'
}

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  DELETED = 'deleted'
}
```

#### 2. Ambulance (Enhanced)
```typescript
interface Ambulance {
  id: UUID;
  
  // Basic Info
  vehicle_number: string;           // License plate, unique
  vehicle_make: string;             // e.g., Mercedes, Ford
  vehicle_model: string;
  year: number;
  vin?: string;                     // Vehicle Identification Number
  
  // Assignment
  hospital_id: UUID;                // Home hospital
  current_driver_id?: UUID;
  paramedics?: UUID[];              // Assigned paramedics
  
  // Location & Tracking
  current_location: GeoPoint;
  heading?: number;                 // Direction in degrees (0-360)
  speed?: number;                   // km/h
  location_history: LocationHistory[]; // Last 100 locations
  
  // Status
  status: AmbulanceStatus;
  availability_status: AvailabilityStatus;
  last_maintenance_date?: Date;
  next_maintenance_due?: Date;
  mileage: number;                  // Total kilometers
  
  // Equipment
  equipment: Equipment[];
  medical_supplies: Supply[];
  
  // Capabilities
  type: AmbulanceType;              // BASIC, ADVANCED, AIR, NEONATAL
  capacity: number;                 // Number of patients
  has_life_support: boolean;
  has_ventilator: boolean;
  has_defibrillator: boolean;
  has_incubator: boolean;
  
  // Performance Metrics
  total_trips: number;
  average_response_time: number;    // minutes
  rating: number;                   // 0-5
  
  // Audit
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at?: Timestamp;
}

enum AmbulanceStatus {
  AVAILABLE = 'available',
  DISPATCHED = 'dispatched',
  EN_ROUTE = 'en_route',
  AT_SCENE = 'at_scene',
  TRANSPORTING = 'transporting',
  AT_HOSPITAL = 'at_hospital',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  OUT_OF_SERVICE = 'out_of_service'
}

enum AmbulanceType {
  BASIC = 'basic',                  // BLS - Basic Life Support
  ADVANCED = 'advanced',            // ALS - Advanced Life Support
  AIR = 'air',                      // Air ambulance
  NEONATAL = 'neonatal',            // Neonatal ambulance
  BARIATRIC = 'bariatric'           // For obese patients
}
```

#### 3. Hospital (Enhanced)
```typescript
interface Hospital {
  id: UUID;
  
  // Basic Info
  name: string;
  short_name?: string;
  registration_number: string;      // Unique government ID
  type: HospitalType;
  
  // Contact
  phone_numbers: PhoneNumber[];
  email: string;
  website?: string;
  
  // Location
  address: Address;
  location: GeoPoint;               // Main entrance coordinates
  service_area_radius?: number;     // Coverage area in km
  
  // Facilities
  total_beds: number;
  available_beds: number;
  icu_beds: number;
  available_icu_beds: number;
  emergency_beds: number;
  available_emergency_beds: number;
  
  // Departments
  departments: Department[];
  specialties: MedicalSpecialty[];
  
  // Operating Theatres
  theatres: Theatre[];
  total_theatres: number;
  available_theatres: number;
  
  // Staff
  doctors: UUID[];
  nurses: UUID[];
  admin_staff: UUID[];
  
  // Services
  services: HospitalService[];
  emergency_services: boolean;
  trauma_center_level?: TraumaCenterLevel;
  
  // Certifications & Ratings
  accreditations: Accreditation[];
  rating: number;                   // 0-5
  total_reviews: number;
  
  // Availability
  is_operational: boolean;
  operating_hours: OperatingHours;
  emergency_24x7: boolean;
  
  // Metrics
  average_wait_time: number;        // minutes
  patient_satisfaction_score: number;
  
  // Audit
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at?: Timestamp;
}

enum HospitalType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  TEACHING = 'teaching',
  SPECIALTY = 'specialty',
  CLINIC = 'clinic',
  TRAUMA_CENTER = 'trauma_center'
}

enum TraumaCenterLevel {
  LEVEL_1 = 'level_1',              // Highest level
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4'
}
```

#### 4. Theatre (Enhanced)
```typescript
interface Theatre {
  id: UUID;
  
  // Basic Info
  hospital_id: UUID;
  name: string;                     // e.g., "OT-1", "Theatre A"
  floor: string;
  room_number: string;
  
  // Type & Capabilities
  type: TheatreType;
  specialties: MedicalSpecialty[];
  
  // Equipment
  equipment: Equipment[];
  has_robotic_surgery: boolean;
  has_imaging: boolean;
  has_hybrid_capabilities: boolean;
  
  // Capacity
  max_team_size: number;
  sterility_class: SterilityClass;
  
  // Availability
  status: TheatreStatus;
  is_available: boolean;
  available_from?: Timestamp;
  available_to?: Timestamp;
  
  // Current Operation
  current_surgery_id?: UUID;
  current_surgeon_id?: UUID;
  estimated_completion?: Timestamp;
  
  // Scheduling
  bookings: TheatreBooking[];
  maintenance_schedule: MaintenanceSchedule[];
  
  // Metrics
  utilization_rate: number;         // Percentage
  average_turnover_time: number;    // minutes
  total_surgeries: number;
  
  // Audit
  created_at: Timestamp;
  updated_at: Timestamp;
  deleted_at?: Timestamp;
}

enum TheatreType {
  GENERAL = 'general',
  CARDIAC = 'cardiac',
  NEURO = 'neuro',
  ORTHOPEDIC = 'orthopedic',
  PEDIATRIC = 'pediatric',
  EMERGENCY = 'emergency',
  HYBRID = 'hybrid',
  DAY_SURGERY = 'day_surgery'
}

enum TheatreStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  CLEANING = 'cleaning',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved',
  EMERGENCY_HOLD = 'emergency_hold',
  OUT_OF_SERVICE = 'out_of_service'
}
```

#### 5. EmergencyRequest (New)
```typescript
interface EmergencyRequest {
  id: UUID;
  
  // Patient Info
  patient_id: UUID;
  patient_name?: string;
  patient_phone?: string;
  
  // Location
  pickup_location: GeoPoint;
  pickup_address: Address;
  destination_hospital_id?: UUID;
  destination_location?: GeoPoint;
  
  // Emergency Details
  emergency_type: EmergencyType;
  severity: EmergencySeverity;
  description: string;
  patient_condition?: string;
  vital_signs?: VitalSigns;
  
  // Assignment
  assigned_ambulance_id?: UUID;
  assigned_driver_id?: UUID;
  assigned_paramedics?: UUID[];
  
  // Status & Tracking
  status: RequestStatus;
  status_history: StatusChange[];
  
  // Timing
  requested_at: Timestamp;
  dispatched_at?: Timestamp;
  arrived_at_scene?: Timestamp;
  departed_scene?: Timestamp;
  arrived_at_hospital?: Timestamp;
  completed_at?: Timestamp;
  
  // Response Metrics
  response_time?: number;           // minutes
  transport_time?: number;          // minutes
  total_time?: number;              // minutes
  
  // Route
  estimated_route?: Route;
  actual_route?: Route;
  distance_km?: number;
  
  // Cost & Billing
  estimated_cost?: number;
  actual_cost?: number;
  payment_status?: PaymentStatus;
  insurance_claim_id?: UUID;
  
  // Notes
  dispatcher_notes?: string;
  driver_notes?: string;
  paramedic_notes?: string;
  
  // Audit
  created_at: Timestamp;
  updated_at: Timestamp;
  cancelled_at?: Timestamp;
  cancellation_reason?: string;
}

enum EmergencyType {
  CARDIAC_ARREST = 'cardiac_arrest',
  RESPIRATORY_DISTRESS = 'respiratory_distress',
  TRAUMA = 'trauma',
  STROKE = 'stroke',
  ACCIDENT = 'accident',
  BURN = 'burn',
  POISONING = 'poisoning',
  MATERNITY = 'maternity',
  PSYCHIATRIC = 'psychiatric',
  OTHER = 'other'
}

enum EmergencySeverity {
  CRITICAL = 'critical',            // Life-threatening
  URGENT = 'urgent',                // Serious but stable
  NON_URGENT = 'non_urgent',        // Minor emergency
  ROUTINE = 'routine'               // Scheduled transport
}

enum RequestStatus {
  PENDING = 'pending',
  DISPATCHED = 'dispatched',
  ACCEPTED = 'accepted',
  EN_ROUTE = 'en_route',
  AT_SCENE = 'at_scene',
  TRANSPORTING = 'transporting',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}
```

#### 6. TheatreBooking (New)
```typescript
interface TheatreBooking {
  id: UUID;
  
  // References
  theatre_id: UUID;
  hospital_id: UUID;
  patient_id: UUID;
  
  // Surgery Details
  surgery_type: SurgeryType;
  procedure_name: string;
  procedure_code?: string;          // ICD-10 or CPT code
  specialty: MedicalSpecialty;
  
  // Medical Team
  lead_surgeon_id: UUID;
  assistant_surgeons?: UUID[];
  anesthesiologist_id?: UUID;
  nurses?: UUID[];
  
  // Scheduling
  scheduled_start: Timestamp;
  scheduled_end: Timestamp;
  actual_start?: Timestamp;
  actual_end?: Timestamp;
  estimated_duration: number;       // minutes
  actual_duration?: number;
  
  // Status
  status: BookingStatus;
  priority: BookingPriority;
  
  // Pre-op
  pre_op_assessment_completed: boolean;
  anesthesia_type?: AnesthesiaType;
  special_requirements?: string[];
  
  // Equipment & Supplies
  required_equipment: Equipment[];
  required_supplies: Supply[];
  
  // Cost & Billing
  estimated_cost?: number;
  actual_cost?: number;
  insurance_approval?: string;
  payment_status?: PaymentStatus;
  
  // Notes
  surgeon_notes?: string;
  anesthesia_notes?: string;
  nursing_notes?: string;
  complications?: string;
  
  // Outcomes
  outcome?: SurgeryOutcome;
  follow_up_required: boolean;
  
  // Audit
  created_at: Timestamp;
  updated_at: Timestamp;
  cancelled_at?: Timestamp;
  cancellation_reason?: string;
  created_by: UUID;
  updated_by?: UUID;
}

enum BookingStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
  NO_SHOW = 'no_show'
}

enum BookingPriority {
  EMERGENCY = 'emergency',          // Immediate
  URGENT = 'urgent',                // Within 24 hours
  SCHEDULED = 'scheduled',          // Planned
  ELECTIVE = 'elective'             // Can be rescheduled
}

enum SurgeryType {
  EMERGENCY = 'emergency',
  URGENT = 'urgent',
  ELECTIVE = 'elective',
  DAY_SURGERY = 'day_surgery'
}
```

#### 7. Notification (New)
```typescript
interface Notification {
  id: UUID;
  
  // Recipient
  user_id: UUID;
  
  // Content
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;       // Additional metadata
  
  // Delivery
  channels: NotificationChannel[];
  priority: NotificationPriority;
  
  // Status
  is_read: boolean;
  read_at?: Timestamp;
  is_delivered: boolean;
  delivered_at?: Timestamp;
  
  // Action
  action_url?: string;
  action_type?: string;
  
  // Expiry
  expires_at?: Timestamp;
  
  // Audit
  created_at: Timestamp;
  updated_at: Timestamp;
}

enum NotificationType {
  EMERGENCY_REQUEST = 'emergency_request',
  AMBULANCE_DISPATCHED = 'ambulance_dispatched',
  AMBULANCE_ARRIVED = 'ambulance_arrived',
  THEATRE_AVAILABLE = 'theatre_available',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_REMINDER = 'booking_reminder',
  STATUS_UPDATE = 'status_update',
  SYSTEM_ALERT = 'system_alert'
}

enum NotificationChannel {
  PUSH = 'push',
  SMS = 'sms',
  EMAIL = 'email',
  IN_APP = 'in_app',
  VOICE = 'voice'
}
```

---

## API Design

### RESTful Endpoints

#### Authentication & Authorization
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/verify-phone
POST   /api/v1/auth/resend-verification
GET    /api/v1/auth/me
PATCH  /api/v1/auth/me
```

#### Users
```
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/users/:id/emergency-contacts
POST   /api/v1/users/:id/emergency-contacts
GET    /api/v1/users/drivers/available
GET    /api/v1/users/doctors/by-specialty
PATCH  /api/v1/users/:id/location
```

#### Ambulances
```
GET    /api/v1/ambulances
GET    /api/v1/ambulances/:id
POST   /api/v1/ambulances
PATCH  /api/v1/ambulances/:id
DELETE /api/v1/ambulances/:id
GET    /api/v1/ambulances/nearby?lat=X&lng=Y&radius=Z
GET    /api/v1/ambulances/available
PATCH  /api/v1/ambulances/:id/status
PATCH  /api/v1/ambulances/:id/location
GET    /api/v1/ambulances/:id/location-history
POST   /api/v1/ambulances/:id/assign-driver
POST   /api/v1/ambulances/:id/maintenance
```

#### Hospitals
```
GET    /api/v1/hospitals
GET    /api/v1/hospitals/:id
POST   /api/v1/hospitals
PATCH  /api/v1/hospitals/:id
DELETE /api/v1/hospitals/:id
GET    /api/v1/hospitals/nearby?lat=X&lng=Y&radius=Z
GET    /api/v1/hospitals/:id/departments
GET    /api/v1/hospitals/:id/theatres
GET    /api/v1/hospitals/:id/availability
PATCH  /api/v1/hospitals/:id/bed-count
GET    /api/v1/hospitals/:id/statistics
```

#### Theatres
```
GET    /api/v1/theatres
GET    /api/v1/theatres/:id
POST   /api/v1/theatres
PATCH  /api/v1/theatres/:id
DELETE /api/v1/theatres/:id
GET    /api/v1/theatres/available?specialty=X&date=Y
GET    /api/v1/theatres/search?hospital_id=X&specialty=Y
PATCH  /api/v1/theatres/:id/status
GET    /api/v1/theatres/:id/schedule
GET    /api/v1/theatres/:id/utilization
```

#### Theatre Bookings
```
GET    /api/v1/bookings
GET    /api/v1/bookings/:id
POST   /api/v1/bookings
PATCH  /api/v1/bookings/:id
DELETE /api/v1/bookings/:id
POST   /api/v1/bookings/:id/cancel
POST   /api/v1/bookings/:id/reschedule
POST   /api/v1/bookings/:id/confirm
GET    /api/v1/bookings/upcoming
GET    /api/v1/bookings/history
PATCH  /api/v1/bookings/:id/check-in
PATCH  /api/v1/bookings/:id/complete
```

#### Emergency Requests
```
GET    /api/v1/emergency-requests
GET    /api/v1/emergency-requests/:id
POST   /api/v1/emergency-requests
PATCH  /api/v1/emergency-requests/:id
DELETE /api/v1/emergency-requests/:id
POST   /api/v1/emergency-requests/:id/dispatch
POST   /api/v1/emergency-requests/:id/cancel
PATCH  /api/v1/emergency-requests/:id/status
GET    /api/v1/emergency-requests/:id/tracking
GET    /api/v1/emergency-requests/active
GET    /api/v1/emergency-requests/history
POST   /api/v1/emergency-requests/:id/estimate
```

#### Notifications
```
GET    /api/v1/notifications
GET    /api/v1/notifications/:id
POST   /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
POST   /api/v1/notifications/mark-all-read
DELETE /api/v1/notifications/:id
GET    /api/v1/notifications/unread-count
PATCH  /api/v1/notifications/preferences
```

#### Analytics & Reports
```
GET    /api/v1/analytics/dashboard
GET    /api/v1/analytics/ambulances/performance
GET    /api/v1/analytics/theatres/utilization
GET    /api/v1/analytics/hospitals/statistics
GET    /api/v1/analytics/emergency-requests/trends
GET    /api/v1/analytics/response-times
POST   /api/v1/reports/generate
GET    /api/v1/reports/:id
GET    /api/v1/reports/templates
```

#### Admin
```
GET    /api/v1/admin/users
PATCH  /api/v1/admin/users/:id/status
POST   /api/v1/admin/users/:id/roles
GET    /api/v1/admin/audit-logs
GET    /api/v1/admin/system-health
GET    /api/v1/admin/metrics
POST   /api/v1/admin/broadcast-notification
```

### GraphQL Schema (Supplementary)
```graphql
type Query {
  # Users
  user(id: ID!): User
  users(filter: UserFilter, pagination: Pagination): UserConnection
  
  # Ambulances
  ambulance(id: ID!): Ambulance
  ambulances(filter: AmbulanceFilter): [Ambulance!]!
  nearbyAmbulances(location: LocationInput!, radius: Float): [Ambulance!]!
  
  # Hospitals
  hospital(id: ID!): Hospital
  hospitals(filter: HospitalFilter): [Hospital!]!
  nearbyHospitals(location: LocationInput!, radius: Float): [Hospital!]!
  
  # Theatres
  theatre(id: ID!): Theatre
  availableTheatres(specialty: String, date: DateTime): [Theatre!]!
  
  # Emergency Requests
  emergencyRequest(id: ID!): EmergencyRequest
  myEmergencyRequests(status: RequestStatus): [EmergencyRequest!]!
  
  # Analytics
  analyticsDashboard: AnalyticsDashboard!
  performanceMetrics(timeRange: TimeRange!): PerformanceMetrics!
}

type Mutation {
  # Auth
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  
  # Emergency Requests
  createEmergencyRequest(input: EmergencyRequestInput!): EmergencyRequest!
  dispatchAmbulance(requestId: ID!, ambulanceId: ID!): EmergencyRequest!
  updateRequestStatus(requestId: ID!, status: RequestStatus!): EmergencyRequest!
  
  # Theatre Bookings
  createBooking(input: BookingInput!): TheatreBooking!
  cancelBooking(bookingId: ID!, reason: String): TheatreBooking!
  
  # Location Updates
  updateLocation(location: LocationInput!): User!
  updateAmbulanceLocation(ambulanceId: ID!, location: LocationInput!): Ambulance!
}

type Subscription {
  # Real-time tracking
  ambulanceLocationUpdated(ambulanceId: ID!): Ambulance!
  emergencyRequestUpdated(requestId: ID!): EmergencyRequest!
  
  # Notifications
  notificationReceived(userId: ID!): Notification!
  
  # Theatre availability
  theatreAvailabilityChanged(hospitalId: ID!): Theatre!
}
```

### WebSocket Events
```typescript
// Client -> Server
'ambulance:location:update'
'ambulance:status:update'
'emergency:request:create'
'emergency:request:cancel'
'tracking:subscribe'
'tracking:unsubscribe'

// Server -> Client
'ambulance:dispatched'
'ambulance:location:changed'
'ambulance:status:changed'
'ambulance:arrived'
'emergency:status:updated'
'notification:new'
'theatre:availability:changed'
```

---

## Advanced Features

### 1. Intelligent Dispatching System
**AI-Powered Ambulance Assignment**
- Machine learning model to predict optimal ambulance assignment
- Factors: distance, traffic, ambulance capabilities, patient severity, historical performance
- Real-time traffic integration (Google Maps Traffic API / HERE Traffic)
- Dynamic rerouting based on traffic conditions
- Priority queuing for critical emergencies

**Implementation**:
```typescript
interface DispatchAlgorithm {
  score(ambulance: Ambulance, request: EmergencyRequest): number;
  
  factors: {
    distance: number;              // Weight: 0.3
    availability: number;          // Weight: 0.25
    capability: number;            // Weight: 0.2
    responseTime: number;          // Weight: 0.15
    rating: number;                // Weight: 0.1
  };
  
  constraints: {
    maxDistance: number;           // km
    maxResponseTime: number;       // minutes
    requiredCapabilities: string[];
  };
}
```

### 2. Predictive Analytics Engine
**Features**:
- Demand forecasting (predict emergency hotspots)
- Resource optimization (optimal ambulance positioning)
- Theatre utilization predictions
- Seasonal trend analysis
- Staffing recommendations

**Technologies**: TensorFlow.js, Prophet (time-series), Apache Spark for big data processing

### 3. Real-Time Tracking & ETA
- Live ambulance tracking with 5-second updates
- Accurate ETA calculations using machine learning
- Route optimization with turn-by-turn navigation
- Geofencing for automatic status updates
- Breadcrumb trail visualization

### 4. Telemedicine Integration
- Video consultation during ambulance transit
- Remote physician guidance to paramedics
- Vital signs streaming to hospital
- Digital triage system
- Integration with Electronic Health Records (EHR)

### 5. Multi-Language & Accessibility
- Support for 10+ languages
- Voice commands (Google Speech-to-Text)
- Screen reader compatibility (WCAG 2.1 Level AA)
- Emergency SOS button with one-tap activation
- Offline mode for basic functionality

### 6. Payment & Insurance
- Multiple payment methods (Card, Wallet, Insurance)
- Insurance verification API integration
- Automated claims processing
- Dynamic pricing based on distance and urgency
- Subscription plans for corporate clients

### 7. Quality Assurance
- Post-trip rating system
- Automated feedback collection
- Performance dashboards for drivers and hospitals
- Incident reporting and tracking
- Compliance monitoring

### 8. Emergency Preparedness
- Disaster mode activation
- Mass casualty incident (MCI) protocols
- Automated hospital load balancing
- Emergency broadcast system
- Integration with civil defense systems

---

## Data Flow & Architecture Diagrams

### Emergency Request Flow
```
Patient -> Mobile App -> API Gateway -> Emergency Service
                                      ↓
                         Dispatch Algorithm (AI)
                                      ↓
                         Ambulance Assignment
                                      ↓
                    WebSocket -> Driver App (Real-time)
                                      ↓
                         Location Tracking (Redis)
                                      ↓
                    Patient App (Live ETA updates)
                                      ↓
                         Hospital Notification
                                      ↓
                         Arrival & Handoff
                                      ↓
                         Trip Completion & Rating
```

### Theatre Booking Flow
```
Doctor/Admin -> Web Portal -> API Gateway -> Booking Service
                                           ↓
                            Check Theatre Availability
                                           ↓
                              Validate Constraints
                                           ↓
                              Create Booking
                                           ↓
                        Send Notifications (Email/SMS)
                                           ↓
                        Update Theatre Schedule
                                           ↓
                        Calendar Integration (iCal)
                                           ↓
                     Pre-op Checklist Generation
```

---

## Security Architecture

### Authentication & Authorization
1. **Multi-Factor Authentication (MFA)**
   - SMS OTP
   - Email verification
   - Biometric (fingerprint, face ID)
   - TOTP (Google Authenticator)

2. **Role-Based Access Control (RBAC)**
   ```typescript
   const permissions = {
     PATIENT: ['request_ambulance', 'view_own_requests', 'book_theatre'],
     DRIVER: ['view_assigned_requests', 'update_location', 'update_status'],
     PARAMEDIC: ['view_patient_info', 'update_medical_notes'],
     DOCTOR: ['book_theatre', 'view_patient_records', 'prescribe'],
     HOSPITAL_ADMIN: ['manage_theatres', 'manage_staff', 'view_analytics'],
     SYSTEM_ADMIN: ['manage_all', 'view_audit_logs', 'system_config']
   };
   ```

3. **API Security**
   - Rate limiting (100 req/min per user, 1000 req/min per IP)
   - API key rotation every 90 days
   - Request signing (HMAC-SHA256)
   - IP whitelisting for admin endpoints

4. **Data Encryption**
   - At rest: AES-256
   - In transit: TLS 1.3
   - Sensitive fields: Field-level encryption
   - Database: Transparent Data Encryption (TDE)

### Compliance
- **HIPAA**: PHI handling, audit trails, access controls
- **GDPR**: Data minimization, right to erasure, consent management
- **SOC 2 Type II**: Security controls, monitoring
- **PCI DSS**: Payment data handling (if applicable)

---

## Performance & Scalability

### Performance Targets
- **API Response Time**: < 200ms (p95), < 500ms (p99)
- **Database Queries**: < 100ms (p95)
- **Real-time Updates**: < 2 seconds latency
- **Concurrent Users**: 100,000+
- **Emergency Requests**: 1,000 concurrent
- **Uptime**: 99.95% SLA

### Scalability Strategy
1. **Horizontal Scaling**: Auto-scaling groups (min: 3, max: 50 instances)
2. **Database Sharding**: By geographic region
3. **Read Replicas**: 3 replicas per region
4. **Caching Strategy**:
   - L1: Application cache (Node.js memory, 5min TTL)
   - L2: Redis (1hour TTL)
   - L3: CDN for static assets
5. **Load Balancing**: Application Load Balancer with health checks
6. **Message Queue**: Kafka for event streaming (retention: 7 days)

### Optimization Techniques
- Database indexing (B-tree, GiST for geospatial)
- Query optimization (EXPLAIN ANALYZE)
- Connection pooling (PgBouncer)
- Lazy loading & pagination
- Image optimization (WebP, lazy loading)
- Code splitting & tree shaking
- Server-side rendering (SSR) for critical pages

---

## Monitoring & Observability

### Metrics Collection
- **Application Metrics**: Response times, error rates, throughput
- **Business Metrics**: Active users, emergency requests, bookings, revenue
- **Infrastructure Metrics**: CPU, memory, disk, network
- **Database Metrics**: Query performance, connections, locks

### Logging Strategy
```typescript
interface LogEntry {
  timestamp: ISO8601;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  service: string;
  traceId: string;
  spanId: string;
  userId?: string;
  message: string;
  context: Record<string, any>;
  stack?: string;
}
```

### Alerting Rules
- **Critical**: Response time > 2s, Error rate > 5%, Database down
- **Warning**: Response time > 1s, Error rate > 2%, Disk > 80%
- **Info**: Deployment events, scaling events

### Dashboards
1. **Executive Dashboard**: Key metrics, active users, revenue
2. **Operations Dashboard**: Emergency requests, ambulance status, response times
3. **Engineering Dashboard**: API performance, error rates, deployments
4. **Business Dashboard**: Bookings, utilization rates, ratings

---

## Testing Strategy

### Test Pyramid
1. **Unit Tests** (70%)
   - Jest for business logic
   - Target: 90% code coverage
   
2. **Integration Tests** (20%)
   - API endpoint testing
   - Database integration
   - External service mocking
   
3. **E2E Tests** (10%)
   - Playwright / Cypress
   - Critical user flows
   - Cross-browser testing

### Additional Testing
- **Load Testing**: Artillery, k6 (target: 10,000 req/s)
- **Security Testing**: OWASP ZAP, Snyk
- **Penetration Testing**: Annual third-party audit
- **Accessibility Testing**: axe-core, Pa11y
- **Performance Testing**: Lighthouse CI (score > 90)

---

## Deployment Strategy

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
stages:
  - lint
  - test
  - build
  - security-scan
  - deploy-staging
  - smoke-tests
  - deploy-production
  - post-deployment-tests
```

### Environments
1. **Development**: Auto-deploy from `develop` branch
2. **Staging**: Mirror of production, auto-deploy from `staging` branch
3. **Production**: Manual approval required, blue-green deployment

### Deployment Strategies
- **Blue-Green Deployment**: Zero-downtime deployments
- **Canary Releases**: 5% -> 25% -> 50% -> 100%
- **Feature Flags**: LaunchDarkly / Unleash for gradual rollout
- **Rollback Plan**: Automated rollback if error rate > 5%

---

## Data Backup & Disaster Recovery

### Backup Strategy
- **Database**: 
  - Full backup: Daily at 2 AM UTC
  - Incremental: Every 6 hours
  - Transaction logs: Continuous
  - Retention: 30 days
  
- **Files & Media**: 
  - S3 versioning enabled
  - Cross-region replication
  - Retention: 90 days

### Disaster Recovery
- **RTO** (Recovery Time Objective): 4 hours
- **RPO** (Recovery Point Objective): 15 minutes
- **DR Site**: Secondary region (active-passive)
- **Failover**: Automated DNS failover via Route53
- **DR Drills**: Quarterly

---

## Cost Optimization

### Infrastructure Costs (Estimated Monthly)
- **Compute** (ECS/EKS): $2,000 - $5,000
- **Database** (RDS PostgreSQL): $1,500 - $3,000
- **Cache** (ElastiCache): $500 - $1,000
- **Storage** (S3): $200 - $500
- **CDN** (CloudFront): $300 - $800
- **API Gateway**: $100 - $300
- **Monitoring** (DataDog): $500 - $1,500
- **Total**: ~$5,100 - $12,100/month

### Cost Optimization Strategies
- Reserved instances for baseline capacity (40% savings)
- Spot instances for batch processing (70% savings)
- S3 Intelligent-Tiering for media files
- CloudFront for reduced origin requests
- Auto-scaling to match demand
- Database query optimization to reduce compute

---

## Migration Plan (From Current System)

### Phase 1: Foundation (Months 1-2)
- [ ] Set up infrastructure (Kubernetes, databases)
- [ ] Implement authentication & authorization
- [ ] Migrate user data
- [ ] Set up CI/CD pipeline

### Phase 2: Core Features (Months 3-4)
- [ ] Implement enhanced ambulance service
- [ ] Build emergency request system with dispatch algorithm
- [ ] Real-time tracking & WebSocket infrastructure
- [ ] Notification system

### Phase 3: Theatre Management (Months 5-6)
- [ ] Theatre booking system
- [ ] Hospital management enhancements
- [ ] Calendar integration
- [ ] Reporting & analytics

### Phase 4: Advanced Features (Months 7-8)
- [ ] AI-powered dispatch optimization
- [ ] Predictive analytics
- [ ] Telemedicine integration
- [ ] Payment & insurance integration

### Phase 5: Testing & Launch (Months 9-10)
- [ ] Comprehensive testing (load, security, E2E)
- [ ] Beta launch with select hospitals
- [ ] Performance tuning
- [ ] Documentation & training

### Phase 6: Production & Optimization (Month 11-12)
- [ ] Production launch
- [ ] Monitoring & optimization
- [ ] User feedback implementation
- [ ] Feature enhancements

---

## API Documentation

### OpenAPI 3.0 Specification
```yaml
openapi: 3.0.0
info:
  title: Ambulance & Theatre Management API
  version: 2.0.0
  description: Comprehensive healthcare resource management platform
  
servers:
  - url: https://api.ambulance-theatre.com/v1
    description: Production
  - url: https://api-staging.ambulance-theatre.com/v1
    description: Staging

security:
  - bearerAuth: []

tags:
  - name: Authentication
  - name: Users
  - name: Ambulances
  - name: Hospitals
  - name: Theatres
  - name: Emergency Requests
  - name: Bookings
  - name: Notifications
  - name: Analytics
```

### Example Endpoint Documentation
```yaml
/emergency-requests:
  post:
    summary: Create emergency request
    tags: [Emergency Requests]
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required: [pickup_location, emergency_type, severity]
            properties:
              pickup_location:
                type: object
                properties:
                  latitude: { type: number, example: 6.5244 }
                  longitude: { type: number, example: 3.3792 }
              emergency_type: 
                type: string
                enum: [cardiac_arrest, trauma, accident]
              severity:
                type: string
                enum: [critical, urgent, non_urgent]
              description: { type: string }
    responses:
      201:
        description: Emergency request created
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmergencyRequest'
      400:
        $ref: '#/components/responses/BadRequest'
      401:
        $ref: '#/components/responses/Unauthorized'
```

---

## Mobile App Considerations

### Platform Support
- **iOS**: 14.0+
- **Android**: 8.0+ (API 26+)
- **Technology**: React Native / Flutter

### Key Features
1. **Patient App**
   - One-tap emergency request
   - Real-time ambulance tracking
   - Medical profile management
   - Trip history
   - Payment management
   
2. **Driver App**
   - Request notifications
   - Turn-by-turn navigation
   - Trip management
   - Earnings tracker
   - Shift scheduling

3. **Hospital Admin App**
   - Theatre management
   - Bed availability updates
   - Staff scheduling
   - Analytics dashboard

### Offline Functionality
- Cache user profile
- Queue emergency requests
- Basic navigation
- Sync when connected

---

## Future Enhancements (Roadmap)

### Year 1
- ✅ Core platform launch
- ✅ AI dispatch system
- ✅ Real-time tracking
- 🔄 Telemedicine integration
- 🔄 Payment gateway

### Year 2
- 🔮 Drone ambulance network for remote areas
- 🔮 AR navigation for paramedics
- 🔮 Blockchain for medical records
- 🔮 IoT integration (smart hospitals)
- 🔮 Voice assistant (Alexa, Google Home)

### Year 3
- 🔮 Predictive health monitoring
- 🔮 AI-powered diagnosis assistance
- 🔮 Global expansion (multi-country)
- 🔮 Healthcare marketplace
- 🔮 Research data platform

---

## Conclusion

This enhanced technical specification represents a complete overhaul of the original ambulance-theatre system, incorporating modern software architecture patterns, scalability best practices, and cutting-edge technologies. The design prioritizes:

1. **Reliability**: 99.95% uptime, robust error handling, disaster recovery
2. **Scalability**: Microservices architecture, horizontal scaling, efficient caching
3. **Security**: End-to-end encryption, HIPAA compliance, multi-factor auth
4. **Performance**: Sub-200ms API responses, real-time updates, optimized queries
5. **User Experience**: Intuitive interfaces, real-time tracking, multi-language support
6. **Innovation**: AI-powered dispatch, predictive analytics, telemedicine

The system is designed to handle millions of users, thousands of concurrent emergency requests, and provide life-saving services with maximum efficiency and reliability.

---

**Document Version**: 2.0  
**Last Updated**: February 3, 2026  
**Authors**: GitHub Copilot (Claude Sonnet 4.5)  
**Classification**: Technical Specification  
**Status**: Final Draft
