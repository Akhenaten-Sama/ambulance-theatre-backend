import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { User } from './src/user/user.entity';
import { Hospital } from './src/hospital/hospital.entity';
import { Theatre } from './src/theatre/theatre.entity';
import { Ambulance } from './src/ambulance/ambulance.entity';
import { Equipment } from './src/common/types';
import {
  UserRole,
  UserStatus,
  Gender,
  BloodGroup,
  AmbulanceType,
  AmbulanceStatus,
  TheatreType,
  TheatreStatus,
  SterilityClass,
  MedicalSpecialty,
  HospitalType,
} from './src/common/enums';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'ambulance_theatre_dev',
  entities: [User, Hospital, Theatre, Ambulance],
  synchronize: true,
});

async function seed() {
  console.log('Connecting to database...');
  await AppDataSource.initialize();
  console.log('Database connected.');

  const userRepo = AppDataSource.getRepository(User);
  const hospitalRepo = AppDataSource.getRepository(Hospital);
  const theatreRepo = AppDataSource.getRepository(Theatre);
  const ambulanceRepo = AppDataSource.getRepository(Ambulance);

  const hashedPassword = await bcrypt.hash('Password123!', 10);
  const point = (lat: number, lng: number) => ({ type: 'Point', coordinates: [lng, lat] });

  // Clean existing records across related tables.
  await AppDataSource.query(`
    DO $$
    DECLARE
      t text;
    BEGIN
      FOREACH t IN ARRAY ARRAY[
        'emergency_requests',
        'theatre_bookings',
        'bookings',
        'notifications',
        'ambulances',
        'theatres',
        'hospitals',
        'users'
      ]
      LOOP
        IF to_regclass(t) IS NOT NULL THEN
          EXECUTE format('TRUNCATE TABLE %I RESTART IDENTITY CASCADE', t);
        END IF;
      END LOOP;
    END $$;
  `);

  console.log('Creating users...');
  const users = await userRepo.save([
    userRepo.create({
      email: 'admin@ambulance-theatre.com',
      phone_number: '+2348011111001',
      password: hashedPassword,
      name: 'Platform Admin',
      role: UserRole.SYSTEM_ADMIN,
      status: UserStatus.ACTIVE,
      gender: Gender.MALE,
      is_email_verified: true,
      is_phone_verified: true,
    }),
    userRepo.create({
      email: 'doctor.lagos@ambulance-theatre.com',
      phone_number: '+2348011111002',
      password: hashedPassword,
      name: 'Dr. Tolu Adeyemi',
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
      gender: Gender.FEMALE,
      is_email_verified: true,
      is_phone_verified: true,
    }),
    userRepo.create({
      email: 'driver.lagos@ambulance-theatre.com',
      phone_number: '+2348011111003',
      password: hashedPassword,
      name: 'Seyi Balogun',
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      gender: Gender.MALE,
      driver_license_number: 'LAG-DRV-23881',
      license_expiry_date: new Date('2028-12-31'),
      is_email_verified: true,
      is_phone_verified: true,
    }),
    userRepo.create({
      email: 'driver.ibadan@ambulance-theatre.com',
      phone_number: '+2348011111004',
      password: hashedPassword,
      name: 'Ridwan Afolabi',
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      gender: Gender.MALE,
      driver_license_number: 'IBA-DRV-99231',
      license_expiry_date: new Date('2029-06-30'),
      is_email_verified: true,
      is_phone_verified: true,
    }),
    userRepo.create({
      email: 'patient@ambulance-theatre.com',
      phone_number: '+2348011111005',
      password: hashedPassword,
      name: 'Kemi Olanrewaju',
      role: UserRole.PATIENT,
      status: UserStatus.ACTIVE,
      gender: Gender.FEMALE,
      blood_group: BloodGroup.O_POSITIVE,
      date_of_birth: new Date('1992-08-11'),
      latitude: 6.5244,
      longitude: 3.3792,
      is_email_verified: true,
      is_phone_verified: true,
    }),
  ]);

    const lagosDriver = users.find((u) => u.email === 'driver.lagos@ambulance-theatre.com')!;
  const ibadanDriver = users.find((u) => u.email === 'driver.ibadan@ambulance-theatre.com')!;

  console.log('Creating hospitals (major Lagos + Ibadan)...');
  // Coordinates researched from Wikidata hospital entries.
  const hospitals = await hospitalRepo.save([
    {
      name: 'Lagos University Teaching Hospital (LUTH)',
      registration_number: 'NG-LAG-LUTH-001',
      phone_numbers: ['+234-1-774-3000'],
      email: 'info@luth.gov.ng',
      address: {
        street: 'Ishaga Road, Idi-Araba',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '101245',
        full_address: 'Idi-Araba, Surulere, Lagos',
      },
      latitude: 6.518889,
      longitude: 3.3555,
      location: point(6.518889, 3.3555),
      type: HospitalType.TEACHING,
      total_beds: 761,
      available_beds: 430,
      icu_beds: 45,
      emergency_beds: 90,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.CARDIOLOGY, MedicalSpecialty.NEUROLOGY, MedicalSpecialty.GENERAL_SURGERY],
      rating: 4.5,
      total_reviews: 1842,
    } as any,
    {
      name: 'Lagos State University Teaching Hospital (LASUTH)',
      registration_number: 'NG-LAG-LASUTH-002',
      phone_numbers: ['+234-1-271-2000'],
      email: 'info@lasuth.org.ng',
      address: {
        street: 'Oba Akinjobi Way, Ikeja',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '101233',
        full_address: 'Oba Akinjobi Way, Ikeja GRA, Lagos',
      },
      latitude: 6.590111,
      longitude: 3.34175,
      location: point(6.590111, 3.34175),
      type: HospitalType.TEACHING,
      total_beds: 500,
      available_beds: 280,
      icu_beds: 35,
      emergency_beds: 65,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.EMERGENCY_MEDICINE, MedicalSpecialty.PEDIATRICS, MedicalSpecialty.ORTHOPEDICS],
      rating: 4.4,
      total_reviews: 1210,
    } as any,
    {
      name: 'Federal Medical Centre, Ebute Metta',
      registration_number: 'NG-LAG-FMCEM-003',
      phone_numbers: ['+234-1-774-6000'],
      email: 'info@fmceb.org',
      address: {
        street: '2 Ondo Street, Ebute Metta',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '101212',
        full_address: '2 Ondo Street, Ebute Metta, Lagos',
      },
      latitude: 6.485083,
      longitude: 3.380182,
      location: point(6.485083, 3.380182),
      type: HospitalType.PUBLIC,
      total_beds: 200,
      available_beds: 126,
      icu_beds: 18,
      emergency_beds: 30,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.GENERAL_SURGERY, MedicalSpecialty.OBSTETRICS],
      rating: 4.2,
      total_reviews: 640,
    } as any,
    {
      name: 'Lagos Island General Hospital (Odan)',
      registration_number: 'NG-LAG-ODAN-004',
      phone_numbers: ['+234-1-266-0900'],
      email: 'admin@lagosislandgh.ng',
      address: {
        street: '216 Broad Street, Odan',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '100001',
        full_address: '216 Broad Street, Lagos Island, Lagos',
      },
      latitude: 6.445278,
      longitude: 3.398333,
      location: point(6.445278, 3.398333),
      type: HospitalType.PUBLIC,
      total_beds: 180,
      available_beds: 93,
      icu_beds: 12,
      emergency_beds: 25,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.EMERGENCY_MEDICINE, MedicalSpecialty.OBSTETRICS, MedicalSpecialty.GYNECOLOGY],
      rating: 4.1,
      total_reviews: 520,
    } as any,
    {
      name: 'National Orthopaedic Hospital, Igbobi',
      registration_number: 'NG-LAG-NOHI-005',
      phone_numbers: ['+234-1-774-5423'],
      email: 'info@nohlagos.gov.ng',
      address: {
        street: '120/124 Ikorodu Road, Igbobi',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '100233',
        full_address: '120/124 Ikorodu Road, Igbobi, Lagos',
      },
      latitude: 6.530954,
      longitude: 3.372997,
      location: point(6.530954, 3.372997),
      type: HospitalType.SPECIALTY,
      total_beds: 450,
      available_beds: 260,
      icu_beds: 20,
      emergency_beds: 40,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.ORTHOPEDICS, MedicalSpecialty.GENERAL_SURGERY],
      rating: 4.3,
      total_reviews: 790,
    } as any,
    {
      name: 'Gbagada General Hospital',
      registration_number: 'NG-LAG-GBAGADA-006',
      phone_numbers: ['+234-905-395-3306'],
      email: 'info@gbagada-gh.ng',
      address: {
        street: '1 Hospital Road, Gbagada',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '100234',
        full_address: '1 Hospital Road, Gbagada, Lagos',
      },
      latitude: 6.552561,
      longitude: 3.3871,
      location: point(6.552561, 3.3871),
      type: HospitalType.PUBLIC,
      total_beds: 118,
      available_beds: 64,
      icu_beds: 10,
      emergency_beds: 20,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.EMERGENCY_MEDICINE, MedicalSpecialty.PEDIATRICS],
      rating: 4.0,
      total_reviews: 430,
    } as any,
    {
      name: 'Reddington Hospital, Victoria Island',
      registration_number: 'NG-LAG-REDDINGTON-007',
      phone_numbers: ['+234-812-800-8187'],
      email: 'care@reddingtonhospital.com',
      address: {
        street: '12 Idowu Martins Street, Victoria Island',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '101241',
        full_address: '12 Idowu Martins Street, Victoria Island, Lagos',
      },
      latitude: 6.433562,
      longitude: 3.420639,
      location: point(6.433562, 3.420639),
      type: HospitalType.PRIVATE,
      total_beds: 120,
      available_beds: 68,
      icu_beds: 14,
      emergency_beds: 22,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.CARDIOLOGY, MedicalSpecialty.NEUROLOGY, MedicalSpecialty.RADIOLOGY],
      rating: 4.4,
      total_reviews: 870,
    } as any,
    {
      name: 'University College Hospital (UCH), Ibadan',
      registration_number: 'NG-IBA-UCH-008',
      phone_numbers: ['+234-2-241-0088'],
      email: 'info@uch-ibadan.org.ng',
      address: {
        street: 'Queen Elizabeth II Road',
        city: 'Ibadan',
        state: 'Oyo',
        country: 'Nigeria',
        postal_code: '200212',
        full_address: 'UCH, Ibadan, Oyo State',
      },
      latitude: 7.402161,
      longitude: 3.902211,
      location: point(7.402161, 3.902211),
      type: HospitalType.TEACHING,
      total_beds: 1000,
      available_beds: 560,
      icu_beds: 52,
      emergency_beds: 110,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.ORTHOPEDICS, MedicalSpecialty.CARDIOLOGY, MedicalSpecialty.OBSTETRICS],
      rating: 4.6,
      total_reviews: 1630,
    } as any,
    {
      name: 'Adeoyo Maternity Teaching Hospital, Ibadan',
      registration_number: 'NG-IBA-ADEOYO-009',
      phone_numbers: ['+234-2-810-2000'],
      email: 'info@adeoyomth.ng',
      address: {
        street: 'Adeoyo-Oje Road, Yemetu',
        city: 'Ibadan',
        state: 'Oyo',
        country: 'Nigeria',
        postal_code: '200253',
        full_address: 'Yemetu, Adeoyo-Oje Road, Ibadan',
      },
      latitude: 7.387111,
      longitude: 3.903056,
      location: point(7.387111, 3.903056),
      type: HospitalType.TEACHING,
      total_beds: 250,
      available_beds: 142,
      icu_beds: 16,
      emergency_beds: 28,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.OBSTETRICS, MedicalSpecialty.GYNECOLOGY, MedicalSpecialty.PEDIATRICS],
      rating: 4.1,
      total_reviews: 410,
    } as any,
    {
      name: 'Ring Road Specialist Hospital Complex, Ibadan',
      registration_number: 'NG-IBA-RINGROAD-010',
      phone_numbers: ['+234-808-112-2796'],
      email: 'admin@ringroadspecialist.ng',
      address: {
        street: 'Ring Road',
        city: 'Ibadan',
        state: 'Oyo',
        country: 'Nigeria',
        postal_code: '200273',
        full_address: 'Ring Road Specialist Hospital Complex, Ibadan',
      },
      latitude: 7.352404,
      longitude: 3.8624,
      location: point(7.352404, 3.8624),
      type: HospitalType.SPECIALTY,
      total_beds: 140,
      available_beds: 82,
      icu_beds: 10,
      emergency_beds: 18,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.GENERAL_SURGERY, MedicalSpecialty.ORTHOPEDICS],
      rating: 4.0,
      total_reviews: 300,
    } as any,
  ]);

  console.log('Creating theatres...');
  for (const hosp of hospitals) {
    await theatreRepo.save([
      theatreRepo.create({
        hospital_id: hosp.id,
        name: `${hosp.name} - General Theatre A`,
        type: TheatreType.GENERAL,
        specialty: 'General Surgery',
        specialties: [MedicalSpecialty.GENERAL_SURGERY],
        status: TheatreStatus.AVAILABLE,
        floor: '2nd Floor',
        room_number: 'OT-201',
        equipment: [
          { name: 'Anesthesia Machine', quantity: 1, status: 'available' },
          { name: 'Operating Table', quantity: 1, status: 'available' },
        ] as Equipment[],
        has_robotic_surgery: false,
        has_imaging: true,
        has_hybrid_capabilities: false,
        max_team_size: 8,
        sterility_class: SterilityClass.CLASS_B,
        total_surgeries: 120,
        average_turnover_time: 48,
        utilization_rate: 72,
      }),
      theatreRepo.create({
        hospital_id: hosp.id,
        name: `${hosp.name} - Emergency Theatre B`,
        type: TheatreType.EMERGENCY,
        specialty: 'Trauma Surgery',
        specialties: [MedicalSpecialty.ORTHOPEDICS, MedicalSpecialty.GENERAL_SURGERY],
        status: TheatreStatus.AVAILABLE,
        floor: '2nd Floor',
        room_number: 'OT-203',
        equipment: [
          { name: 'Ventilator', quantity: 1, status: 'available' },
          { name: 'Monitor', quantity: 2, status: 'available' },
        ] as Equipment[],
        has_robotic_surgery: false,
        has_imaging: true,
        has_hybrid_capabilities: true,
        max_team_size: 10,
        sterility_class: SterilityClass.CLASS_B,
        total_surgeries: 95,
        average_turnover_time: 42,
        utilization_rate: 79,
      }),
    ]);
  }

  console.log('Creating ambulances...');
  await ambulanceRepo.save([({
      vehicle_number: 'AMB-LAG-101',
      vehicle_make: 'Toyota',
      vehicle_model: 'Hiace',
      year: 2023,
      vin: 'JTF123456LAG101AA',
      hospital_id: hospitals[0].id,
      current_driver_id: lagosDriver.id,
      type: AmbulanceType.ALS,
      status: AmbulanceStatus.AVAILABLE,
      latitude: 6.5212,
      longitude: 3.3621,
      current_location: point(6.5212, 3.3621),
      available: true,
      has_life_support: true,
      capacity: 2,
      equipment: [
        { name: 'Defibrillator', quantity: 1, status: 'available' },
        { name: 'Portable Ventilator', quantity: 1, status: 'available' },
      ] as Equipment[],
      rating: 4.7,
      total_trips: 224,
    } as any),({
      vehicle_number: 'AMB-LAG-202',
      vehicle_make: 'Mercedes-Benz',
      vehicle_model: 'Sprinter',
      year: 2022,
      vin: 'WDB987654LAG202BB',
      hospital_id: hospitals[3].id,
      current_driver_id: lagosDriver.id,
      type: AmbulanceType.BLS,
      status: AmbulanceStatus.AVAILABLE,
      latitude: 6.4464,
      longitude: 3.4041,
      current_location: point(6.4464, 3.4041),
      available: true,
      has_life_support: false,
      capacity: 2,
      equipment: [
        { name: 'Oxygen Cylinder', quantity: 2, status: 'available' },
      ] as Equipment[],
      rating: 4.4,
      total_trips: 141,
    } as any),({
      vehicle_number: 'AMB-IBA-303',
      vehicle_make: 'Ford',
      vehicle_model: 'Transit',
      year: 2023,
      vin: 'FTR123777IBA303CC',
      hospital_id: hospitals[7].id,
      current_driver_id: ibadanDriver.id,
      type: AmbulanceType.ALS,
      status: AmbulanceStatus.AVAILABLE,
      latitude: 7.4022,
      longitude: 3.9022,
      current_location: point(7.4022, 3.9022),
      available: true,
      has_life_support: true,
      capacity: 2,
      equipment: [
        { name: 'Cardiac Monitor', quantity: 1, status: 'available' },
      ] as Equipment[],
      rating: 4.6,
      total_trips: 189,
    } as any),({
      vehicle_number: 'AMB-IBA-404',
      vehicle_make: 'Toyota',
      vehicle_model: 'Hiace',
      year: 2021,
      vin: 'TYT994422IBA404DD',
      hospital_id: hospitals[8].id,
      current_driver_id: ibadanDriver.id,
      type: AmbulanceType.BLS,
      status: AmbulanceStatus.AVAILABLE,
      latitude: 7.3871,
      longitude: 3.9031,
      current_location: point(7.3871, 3.9031),
      available: true,
      has_life_support: false,
      capacity: 2,
      equipment: [
        { name: 'First Aid Kit', quantity: 4, status: 'available' },
      ] as Equipment[],
      rating: 4.3,
      total_trips: 102,
    } as any),
  ]);

  console.log('Seed complete.');
  console.log('Login: admin@ambulance-theatre.com / Password123!');

  await AppDataSource.destroy();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  try {
    await AppDataSource.destroy();
  } catch {}
  process.exit(1);
});


