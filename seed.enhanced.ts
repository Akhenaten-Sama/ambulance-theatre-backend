// seed.enhanced.ts - Comprehensive seed data for testing
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './src/user/user.entity';
import { Hospital } from './src/hospital/hospital.entity';
import { Theatre } from './src/theatre/theatre.entity';
import { Ambulance } from './src/ambulance/ambulance.entity';
import { EmergencyRequest } from './src/emergency-request/emergency-request.entity';
import { TheatreBooking } from './src/booking/booking.entity';
import { Notification } from './src/notification/notification.entity';
import * as dotenv from 'dotenv';
import {
  UserRole,
  UserStatus,
  BloodGroup,
  Gender,
  AmbulanceType,
  AmbulanceStatus,
  TheatreType,
  TheatreStatus,
  EmergencyType,
  EmergencyStatus,
  Severity,
  BookingStatus,
  NotificationType,
  NotificationChannel,
  NotificationPriority,
} from './src/common/enums';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Hospital, Theatre, Ambulance, EmergencyRequest, TheatreBooking, Notification],
  synchronize: true,
});

async function seed() {
  console.log('🌱 Starting enhanced database seed...');

  await AppDataSource.initialize();
  console.log('✅ Database connected');

  const userRepo = AppDataSource.getRepository(User);
  const hospitalRepo = AppDataSource.getRepository(Hospital);
  const theatreRepo = AppDataSource.getRepository(Theatre);
  const ambulanceRepo = AppDataSource.getRepository(Ambulance);
  const emergencyRepo = AppDataSource.getRepository(EmergencyRequest);
  const bookingRepo = AppDataSource.getRepository(TheatreBooking);
  const notificationRepo = AppDataSource.getRepository(Notification);

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...');
  await notificationRepo.delete({});
  await bookingRepo.delete({});
  await emergencyRepo.delete({});
  await ambulanceRepo.delete({});
  await theatreRepo.delete({});
  await hospitalRepo.delete({});
  await userRepo.delete({});

  const password = await bcrypt.hash('password123', 10);

  // ========== USERS ==========
  console.log('👥 Creating users...');

  // Super Admin
  const superAdmin = await userRepo.save(
    userRepo.create({
      name: 'Super Admin',
      email: 'superadmin@ambulance.com',
      phone_number: '+2348000000001',
      password,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      is_phone_verified: true,
      gender: Gender.MALE,
    }),
  );

  // System Admin
  const systemAdmin = await userRepo.save(
    userRepo.create({
      name: 'System Administrator',
      email: 'sysadmin@ambulance.com',
      phone_number: '+2348000000002',
      password,
      role: UserRole.SYSTEM_ADMIN,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      is_phone_verified: true,
      gender: Gender.FEMALE,
    }),
  );

  // Hospital Admins
  const hospitalAdmin1 = await userRepo.save(
    userRepo.create({
      name: 'Dr. Adebayo Ola',
      email: 'admin.luth@hospital.com',
      phone_number: '+2348100000001',
      password,
      role: UserRole.HOSPITAL_ADMIN,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
    }),
  );

  const hospitalAdmin2 = await userRepo.save(
    userRepo.create({
      name: 'Dr. Amina Ibrahim',
      email: 'admin.uch@hospital.com',
      phone_number: '+2348100000002',
      password,
      role: UserRole.HOSPITAL_ADMIN,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.FEMALE,
    }),
  );

  // Doctors
  const doctors = await userRepo.save([
    userRepo.create({
      name: 'Dr. Chidi Okonkwo',
      email: 'chidi.okonkwo@hospital.com',
      phone_number: '+2348200000001',
      password,
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
      specialization: 'Cardiothoracic Surgery',
      license_number: 'MED-NG-12345',
    }),
    userRepo.create({
      name: 'Dr. Fatima Yusuf',
      email: 'fatima.yusuf@hospital.com',
      phone_number: '+2348200000002',
      password,
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.FEMALE,
      specialization: 'Neurosurgery',
      license_number: 'MED-NG-12346',
    }),
    userRepo.create({
      name: 'Dr. Emeka Nnamdi',
      email: 'emeka.nnamdi@hospital.com',
      phone_number: '+2348200000003',
      password,
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
      specialization: 'Orthopedic Surgery',
      license_number: 'MED-NG-12347',
    }),
  ]);

  // Nurses
  const nurses = await userRepo.save([
    userRepo.create({
      name: 'Nurse Blessing Okoro',
      email: 'blessing.okoro@hospital.com',
      phone_number: '+2348300000001',
      password,
      role: UserRole.NURSE,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.FEMALE,
      license_number: 'NUR-NG-54321',
    }),
    userRepo.create({
      name: 'Nurse James Adeola',
      email: 'james.adeola@hospital.com',
      phone_number: '+2348300000002',
      password,
      role: UserRole.NURSE,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
      license_number: 'NUR-NG-54322',
    }),
  ]);

  // Ambulance Drivers
  const drivers = await userRepo.save([
    userRepo.create({
      name: 'Tunde Bakare',
      email: 'tunde.bakare@ambulance.com',
      phone_number: '+2348400000001',
      password,
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
      driver_license_number: 'DRV-NG-98765',
      years_of_experience: 8,
    }),
    userRepo.create({
      name: 'Ngozi Eze',
      email: 'ngozi.eze@ambulance.com',
      phone_number: '+2348400000002',
      password,
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.FEMALE,
      driver_license_number: 'DRV-NG-98766',
      years_of_experience: 5,
    }),
    userRepo.create({
      name: 'Ahmed Musa',
      email: 'ahmed.musa@ambulance.com',
      phone_number: '+2348400000003',
      password,
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
      driver_license_number: 'DRV-NG-98767',
      years_of_experience: 10,
    }),
  ]);

  // Paramedics
  const paramedics = await userRepo.save([
    userRepo.create({
      name: 'Samuel Adewale',
      email: 'samuel.adewale@ambulance.com',
      phone_number: '+2348500000001',
      password,
      role: UserRole.PARAMEDIC,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
      license_number: 'PARA-NG-11111',
    }),
    userRepo.create({
      name: 'Mary Ogunleye',
      email: 'mary.ogunleye@ambulance.com',
      phone_number: '+2348500000002',
      password,
      role: UserRole.PARAMEDIC,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.FEMALE,
      license_number: 'PARA-NG-11112',
    }),
  ]);

  // Patients
  const patients = await userRepo.save([
    userRepo.create({
      name: 'John Okafor',
      email: 'john.okafor@gmail.com',
      phone_number: '+2348600000001',
      password,
      role: UserRole.PATIENT,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
      date_of_birth: new Date('1985-03-15'),
      blood_group: BloodGroup.O_POSITIVE,
      medical_conditions: ['Hypertension'],
      allergies: ['Penicillin'],
      emergency_contacts: [
        { name: 'Jane Okafor', relationship: 'Wife', phone_number: '+2348600000002' },
      ],
    }),
    userRepo.create({
      name: 'Aisha Mohammed',
      email: 'aisha.mohammed@gmail.com',
      phone_number: '+2348600000003',
      password,
      role: UserRole.PATIENT,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.FEMALE,
      date_of_birth: new Date('1990-07-22'),
      blood_group: BloodGroup.A_POSITIVE,
      medical_conditions: [],
      allergies: [],
    }),
    userRepo.create({
      name: 'David Ojo',
      email: 'david.ojo@gmail.com',
      phone_number: '+2348600000004',
      password,
      role: UserRole.PATIENT,
      status: UserStatus.ACTIVE,
      is_email_verified: true,
      gender: Gender.MALE,
      date_of_birth: new Date('1978-11-30'),
      blood_group: BloodGroup.B_POSITIVE,
      medical_conditions: ['Diabetes Type 2', 'Asthma'],
      allergies: ['Sulfa drugs'],
    }),
  ]);

  console.log(`✅ Created ${await userRepo.count()} users`);

  // ========== HOSPITALS ==========
  console.log('🏥 Creating hospitals...');

  const hospitals = await hospitalRepo.save([
    hospitalRepo.create({
      name: 'Lagos University Teaching Hospital (LUTH)',
      address: 'Idi-Araba, Surulere, Lagos',
      latitude: 6.4969,
      longitude: 3.3552,
      phone_numbers: ['+234-1-8723458', '+234-1-8723459'],
      email: 'info@luth.gov.ng',
      registration_number: 'HOSP-NG-LUTH-001',
      type: 'Teaching Hospital',
      total_beds: 750,
      available_beds: 520,
      icu_beds: 50,
      emergency_beds: 100,
      departments: [
        'Emergency Medicine',
        'Surgery',
        'Cardiology',
        'Neurology',
        'Pediatrics',
        'Obstetrics & Gynecology',
      ],
      specialties: [
        'Cardiothoracic Surgery',
        'Neurosurgery',
        'Orthopedic Surgery',
        'Oncology',
      ],
      accreditations: ['NHIS', 'MDCN', 'ISO 9001:2015'],
      rating: 4.5,
      total_reviews: 1240,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      operating_hours: {
        monday: { open: '00:00', close: '23:59' },
        tuesday: { open: '00:00', close: '23:59' },
        wednesday: { open: '00:00', close: '23:59' },
        thursday: { open: '00:00', close: '23:59' },
        friday: { open: '00:00', close: '23:59' },
        saturday: { open: '00:00', close: '23:59' },
        sunday: { open: '00:00', close: '23:59' },
      },
      staff_ids: [hospitalAdmin1.id, ...doctors.map((d) => d.id), ...nurses.map((n) => n.id)],
    }),
    hospitalRepo.create({
      name: 'University College Hospital Ibadan (UCH)',
      address: 'Queen Elizabeth Road, Ibadan, Oyo State',
      latitude: 7.4367,
      longitude: 3.9,
      phone_numbers: ['+234-2-8101234'],
      email: 'info@uchng.org',
      registration_number: 'HOSP-NG-UCH-002',
      type: 'Teaching Hospital',
      total_beds: 850,
      available_beds: 600,
      icu_beds: 60,
      emergency_beds: 120,
      departments: ['Emergency', 'Surgery', 'Internal Medicine', 'Radiology'],
      specialties: ['Neurosurgery', 'Cardiology', 'Oncology'],
      accreditations: ['NHIS', 'MDCN'],
      rating: 4.3,
      total_reviews: 980,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      operating_hours: {
        monday: { open: '00:00', close: '23:59' },
        tuesday: { open: '00:00', close: '23:59' },
        wednesday: { open: '00:00', close: '23:59' },
        thursday: { open: '00:00', close: '23:59' },
        friday: { open: '00:00', close: '23:59' },
        saturday: { open: '00:00', close: '23:59' },
        sunday: { open: '00:00', close: '23:59' },
      },
      staff_ids: [hospitalAdmin2.id],
    }),
    hospitalRepo.create({
      name: 'National Hospital Abuja',
      address: 'Plot 132, Central Area, Abuja',
      latitude: 9.0765,
      longitude: 7.3986,
      phone_numbers: ['+234-9-4613380'],
      email: 'info@nationalhospitalabuja.gov.ng',
      registration_number: 'HOSP-NG-NHA-003',
      type: 'Federal Medical Centre',
      total_beds: 600,
      available_beds: 420,
      icu_beds: 40,
      emergency_beds: 80,
      departments: ['Emergency', 'Surgery', 'Cardiology'],
      specialties: ['Cardiac Surgery', 'Trauma Surgery'],
      rating: 4.6,
      total_reviews: 1560,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      operating_hours: {
        monday: { open: '00:00', close: '23:59' },
        tuesday: { open: '00:00', close: '23:59' },
        wednesday: { open: '00:00', close: '23:59' },
        thursday: { open: '00:00', close: '23:59' },
        friday: { open: '00:00', close: '23:59' },
        saturday: { open: '00:00', close: '23:59' },
        sunday: { open: '00:00', close: '23:59' },
      },
    }),
  ]);

  console.log(`✅ Created ${hospitals.length} hospitals`);

  // ========== THEATRES ==========
  console.log('🏥 Creating operating theatres...');

  const theatres = [];

  // LUTH Theatres
  theatres.push(
    ...(await theatreRepo.save([
      theatreRepo.create({
        hospital: hospitals[0],
        name: 'Main Operating Theatre 1',
        type: TheatreType.GENERAL,
        specialty: 'General Surgery',
        status: TheatreStatus.AVAILABLE,
        floor: '2nd Floor',
        room_number: 'OT-201',
        equipment: [
          'Anesthesia Machine',
          'Operating Table',
          'Surgical Lights',
          'Electrocautery',
          'Ventilator',
        ],
        capabilities: {
          has_robotic_surgery: false,
          has_imaging: true,
          has_minimally_invasive: true,
        },
        capacity: 8,
        sterility_class: 'ISO Class 5',
        total_surgeries: 245,
        average_turnover_time: 45,
        utilization_rate: 78.5,
      }),
      theatreRepo.create({
        hospital: hospitals[0],
        name: 'Cardiothoracic Theatre',
        type: TheatreType.CARDIOTHORACIC,
        specialty: 'Cardiothoracic Surgery',
        status: TheatreStatus.AVAILABLE,
        floor: '3rd Floor',
        room_number: 'OT-301',
        equipment: [
          'Heart-Lung Machine',
          'Anesthesia Machine',
          'Operating Table',
          'Advanced Monitoring',
          'Defibrillator',
        ],
        capabilities: {
          has_robotic_surgery: true,
          has_imaging: true,
          has_minimally_invasive: true,
        },
        capacity: 12,
        sterility_class: 'ISO Class 5',
        total_surgeries: 89,
        average_turnover_time: 60,
        utilization_rate: 65.2,
      }),
      theatreRepo.create({
        hospital: hospitals[0],
        name: 'Neurosurgery Theatre',
        type: TheatreType.NEUROSURGERY,
        specialty: 'Neurosurgery',
        status: TheatreStatus.AVAILABLE,
        floor: '3rd Floor',
        room_number: 'OT-302',
        equipment: [
          'Neurosurgical Microscope',
          'Neuronavigation System',
          'Operating Table',
          'Anesthesia Machine',
        ],
        capabilities: {
          has_robotic_surgery: false,
          has_imaging: true,
          has_minimally_invasive: true,
        },
        capacity: 10,
        sterility_class: 'ISO Class 5',
        total_surgeries: 134,
        average_turnover_time: 55,
        utilization_rate: 72.3,
      }),
    ])),
  );

  // UCH Theatres
  theatres.push(
    ...(await theatreRepo.save([
      theatreRepo.create({
        hospital: hospitals[1],
        name: 'General Theatre 1',
        type: TheatreType.GENERAL,
        specialty: 'General Surgery',
        status: TheatreStatus.AVAILABLE,
        floor: '1st Floor',
        room_number: 'OT-101',
        equipment: ['Anesthesia Machine', 'Operating Table', 'Surgical Lights'],
        capabilities: {
          has_robotic_surgery: false,
          has_imaging: false,
          has_minimally_invasive: true,
        },
        capacity: 8,
        sterility_class: 'ISO Class 5',
        total_surgeries: 198,
        average_turnover_time: 40,
        utilization_rate: 81.4,
      }),
      theatreRepo.create({
        hospital: hospitals[1],
        name: 'Orthopedic Theatre',
        type: TheatreType.ORTHOPEDIC,
        specialty: 'Orthopedic Surgery',
        status: TheatreStatus.AVAILABLE,
        floor: '2nd Floor',
        room_number: 'OT-201',
        equipment: ['C-Arm', 'Bone Saw', 'Operating Table', 'Anesthesia Machine'],
        capabilities: {
          has_robotic_surgery: false,
          has_imaging: true,
          has_minimally_invasive: false,
        },
        capacity: 8,
        sterility_class: 'ISO Class 5',
        total_surgeries: 167,
        average_turnover_time: 50,
        utilization_rate: 69.8,
      }),
    ])),
  );

  console.log(`✅ Created ${theatres.length} operating theatres`);

  // ========== AMBULANCES ==========
  console.log('🚑 Creating ambulances...');

  const ambulances = await ambulanceRepo.save([
    ambulanceRepo.create({
      driver: drivers[0],
      type: AmbulanceType.ALS,
      vehicle_number: 'AMB-LG-001',
      status: AmbulanceStatus.AVAILABLE,
      latitude: 6.5244,
      longitude: 3.3792,
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2022,
      vin: 'WDB9066651K123456',
      equipment: [
        'Defibrillator',
        'Ventilator',
        'ECG Monitor',
        'Oxygen Tank',
        'Stretcher',
        'First Aid Kit',
      ],
      medical_supplies: ['Bandages', 'IV Fluids', 'Medications', 'Syringes'],
      capabilities: {
        has_life_support: true,
        has_ventilator: true,
        has_defibrillator: true,
        has_oxygen: true,
      },
      total_trips: 142,
      average_response_time: 12,
      rating: 4.7,
      total_distance_covered: 8452.3,
      fuel_efficiency: 8.5,
    }),
    ambulanceRepo.create({
      driver: drivers[1],
      type: AmbulanceType.BLS,
      vehicle_number: 'AMB-LG-002',
      status: AmbulanceStatus.AVAILABLE,
      latitude: 6.4549,
      longitude: 3.3841,
      make: 'Ford',
      model: 'Transit',
      year: 2021,
      vin: '1FTBW3XM8MKA12345',
      equipment: ['Stretcher', 'Oxygen Tank', 'First Aid Kit', 'Splints'],
      medical_supplies: ['Bandages', 'Basic Medications'],
      capabilities: {
        has_life_support: false,
        has_ventilator: false,
        has_defibrillator: false,
        has_oxygen: true,
      },
      total_trips: 98,
      average_response_time: 15,
      rating: 4.4,
      total_distance_covered: 5231.8,
      fuel_efficiency: 10.2,
    }),
    ambulanceRepo.create({
      driver: drivers[2],
      type: AmbulanceType.CRITICAL_CARE,
      vehicle_number: 'AMB-LG-003',
      status: AmbulanceStatus.AVAILABLE,
      latitude: 6.4281,
      longitude: 3.4219,
      make: 'Mercedes-Benz',
      model: 'Sprinter ICU',
      year: 2023,
      vin: 'WDB9066651K654321',
      equipment: [
        'Advanced Ventilator',
        'Cardiac Monitor',
        'Defibrillator',
        'Infusion Pumps',
        'Portable Ultrasound',
      ],
      medical_supplies: ['Advanced Medications', 'IV Fluids', 'Blood Products'],
      capabilities: {
        has_life_support: true,
        has_ventilator: true,
        has_defibrillator: true,
        has_oxygen: true,
      },
      total_trips: 67,
      average_response_time: 10,
      rating: 4.9,
      total_distance_covered: 3894.5,
      fuel_efficiency: 7.8,
    }),
  ]);

  console.log(`✅ Created ${ambulances.length} ambulances`);

  // ========== EMERGENCY REQUESTS ==========
  console.log('🚨 Creating emergency requests...');

  const emergencyRequests = await emergencyRepo.save([
    emergencyRepo.create({
      patient: patients[0],
      emergency_type: EmergencyType.CARDIAC_ARREST,
      severity: Severity.CRITICAL,
      status: EmergencyStatus.COMPLETED,
      pickup_latitude: 6.5244,
      pickup_longitude: 3.3792,
      pickup_address: '15 Lagos Street, Ikeja, Lagos',
      destination_latitude: hospitals[0].latitude,
      destination_longitude: hospitals[0].longitude,
      destination_address: hospitals[0].address,
      destination_hospital: hospitals[0],
      assigned_ambulance: ambulances[0],
      assigned_driver: drivers[0],
      assigned_paramedics: [paramedics[0].id],
      description: 'Patient experiencing severe chest pain and difficulty breathing',
      response_time_minutes: 8,
      transport_time_minutes: 15,
      total_distance_km: 7.2,
      estimated_cost: 15000,
      actual_cost: 15000,
      notes: 'Patient stabilized on-site before transport',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }),
    emergencyRepo.create({
      patient: patients[1],
      emergency_type: EmergencyType.ACCIDENT,
      severity: Severity.HIGH,
      status: EmergencyStatus.IN_TRANSIT,
      pickup_latitude: 6.4549,
      pickup_longitude: 3.3841,
      pickup_address: 'Lekki-Epe Expressway, Lagos',
      destination_latitude: hospitals[0].latitude,
      destination_longitude: hospitals[0].longitude,
      destination_address: hospitals[0].address,
      destination_hospital: hospitals[0],
      assigned_ambulance: ambulances[1],
      assigned_driver: drivers[1],
      assigned_paramedics: [paramedics[1].id],
      description: 'Road traffic accident, multiple injuries',
      response_time_minutes: 12,
      estimated_cost: 20000,
      notes: 'Patient conscious, multiple fractures suspected',
    }),
    emergencyRepo.create({
      patient: patients[2],
      emergency_type: EmergencyType.MEDICAL,
      severity: Severity.MEDIUM,
      status: EmergencyStatus.PENDING,
      pickup_latitude: 6.4281,
      pickup_longitude: 3.4219,
      pickup_address: '42 Awolowo Road, Ikoyi, Lagos',
      destination_latitude: hospitals[0].latitude,
      destination_longitude: hospitals[0].longitude,
      destination_address: hospitals[0].address,
      description: 'Severe diabetic episode, patient unresponsive',
      estimated_cost: 12000,
    }),
  ]);

  console.log(`✅ Created ${emergencyRequests.length} emergency requests`);

  // ========== THEATRE BOOKINGS ==========
  console.log('📅 Creating theatre bookings...');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(14, 0, 0, 0);

  const bookings = await bookingRepo.save([
    bookingRepo.create({
      patient: patients[0],
      theatre: theatres[1],
      hospital: hospitals[0],
      lead_surgeon: doctors[0],
      anesthesiologist: doctors[1],
      surgery_type: 'Coronary Artery Bypass Grafting',
      description: 'CABG procedure for severe coronary artery disease',
      scheduled_start_time: tomorrow,
      scheduled_end_time: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000), // 4 hours
      estimated_duration_minutes: 240,
      status: BookingStatus.CONFIRMED,
      assistant_surgeons: [doctors[2].id],
      nurses: [nurses[0].id, nurses[1].id],
      equipment_required: ['Heart-Lung Machine', 'Advanced Monitoring'],
      supplies_required: ['Surgical Sutures', 'Grafts', 'Sterilization Supplies'],
      pre_op_assessment: {
        completed: true,
        date: new Date(),
        notes: 'Patient cleared for surgery',
      },
      estimated_cost: 2500000,
    }),
    bookingRepo.create({
      patient: patients[1],
      theatre: theatres[2],
      hospital: hospitals[0],
      lead_surgeon: doctors[1],
      anesthesiologist: doctors[0],
      surgery_type: 'Brain Tumor Resection',
      description: 'Removal of benign brain tumor',
      scheduled_start_time: nextWeek,
      scheduled_end_time: new Date(nextWeek.getTime() + 6 * 60 * 60 * 1000), // 6 hours
      estimated_duration_minutes: 360,
      status: BookingStatus.CONFIRMED,
      nurses: [nurses[0].id],
      equipment_required: ['Neurosurgical Microscope', 'Neuronavigation System'],
      supplies_required: ['Craniotomy Kit', 'Surgical Sutures'],
      pre_op_assessment: {
        completed: true,
        date: new Date(),
        notes: 'MRI completed, patient stable',
      },
      estimated_cost: 3500000,
    }),
  ]);

  console.log(`✅ Created ${bookings.length} theatre bookings`);

  // ========== NOTIFICATIONS ==========
  console.log('🔔 Creating notifications...');

  const notifications = await notificationRepo.save([
    notificationRepo.create({
      user: patients[0],
      type: NotificationType.EMERGENCY_REQUEST,
      title: 'Emergency Request Confirmed',
      message: 'Your emergency request has been confirmed. Ambulance AMB-LG-001 is on the way.',
      channels: [NotificationChannel.IN_APP, NotificationChannel.SMS],
      priority: NotificationPriority.URGENT,
      is_read: true,
      read_at: new Date(),
      is_delivered: true,
      delivered_at: new Date(),
      data: { request_id: emergencyRequests[0].id },
    }),
    notificationRepo.create({
      user: patients[0],
      type: NotificationType.BOOKING_CONFIRMED,
      title: 'Surgery Booking Confirmed',
      message: `Your surgery has been scheduled for ${tomorrow.toLocaleString()}`,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      priority: NotificationPriority.HIGH,
      is_read: false,
      is_delivered: true,
      delivered_at: new Date(),
      data: { booking_id: bookings[0].id },
    }),
    notificationRepo.create({
      user: patients[1],
      type: NotificationType.AMBULANCE_DISPATCHED,
      title: 'Ambulance Dispatched',
      message: 'An ambulance has been dispatched to your location. ETA: 12 minutes',
      channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
      priority: NotificationPriority.URGENT,
      is_read: false,
      is_delivered: true,
      delivered_at: new Date(),
      data: { ambulance_id: ambulances[1].id },
    }),
  ]);

  console.log(`✅ Created ${notifications.length} notifications`);

  // Summary
  console.log('\n🎉 Seed completed successfully!');
  console.log('=================================');
  console.log(`👥 Users: ${await userRepo.count()}`);
  console.log(`🏥 Hospitals: ${await hospitalRepo.count()}`);
  console.log(`🏥 Theatres: ${await theatreRepo.count()}`);
  console.log(`🚑 Ambulances: ${await ambulanceRepo.count()}`);
  console.log(`🚨 Emergency Requests: ${await emergencyRepo.count()}`);
  console.log(`📅 Bookings: ${await bookingRepo.count()}`);
  console.log(`🔔 Notifications: ${await notificationRepo.count()}`);
  console.log('=================================\n');

  console.log('📋 Test Credentials:');
  console.log('  Super Admin: superadmin@ambulance.com / password123');
  console.log('  System Admin: sysadmin@ambulance.com / password123');
  console.log('  Patient: john.okafor@gmail.com / password123');
  console.log('  Doctor: chidi.okonkwo@hospital.com / password123');
  console.log('  Driver: tunde.bakare@ambulance.com / password123');
  console.log('  Paramedic: samuel.adewale@ambulance.com / password123');
  console.log('\n');

  await AppDataSource.destroy();
}

seed()
  .then(() => {
    console.log('✅ Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
