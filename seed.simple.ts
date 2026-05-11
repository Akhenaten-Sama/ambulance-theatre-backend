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

  console.log('Creating hospitals (Lagos + Ibadan)...');
  const hospitals = await hospitalRepo.save([({
      name: 'Lagos University Teaching Hospital (LUTH)',
      registration_number: 'NG-LAG-LUTH-001',
      phone_numbers: ['+234-1-774-3000'],
      email: 'info@luth.gov.ng',
      address: {
        street: 'Idi-Araba Road',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '101245',
        full_address: 'Idi-Araba, Surulere, Lagos',
      },
      latitude: 6.5169,
      longitude: 3.3622,
      location: point(6.5169, 3.3622),
      type: HospitalType.TEACHING,
      total_beds: 761,
      available_beds: 438,
      icu_beds: 45,
      emergency_beds: 90,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.CARDIOLOGY, MedicalSpecialty.NEUROLOGY, MedicalSpecialty.GENERAL_SURGERY],
      rating: 4.5,
      total_reviews: 1842,
    } as any),({
      name: 'University College Hospital (UCH), Ibadan',
      registration_number: 'NG-IBA-UCH-001',
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
      latitude: 7.4025,
      longitude: 3.8991,
      location: point(7.4025, 3.8991),
      type: HospitalType.TEACHING,
      total_beds: 850,
      available_beds: 501,
      icu_beds: 52,
      emergency_beds: 110,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.ORTHOPEDICS, MedicalSpecialty.CARDIOLOGY, MedicalSpecialty.OBSTETRICS],
      rating: 4.6,
      total_reviews: 1630,
    } as any),({
      name: 'Lagoon Hospitals, Ikoyi',
      registration_number: 'NG-LAG-LAGOON-009',
      phone_numbers: ['+234-1-277-8000'],
      email: 'care@lagoonhospitals.com',
      address: {
        street: 'Bourdillon Road',
        city: 'Lagos',
        state: 'Lagos',
        country: 'Nigeria',
        postal_code: '106104',
        full_address: 'Bourdillon Road, Ikoyi, Lagos',
      },
      latitude: 6.4476,
      longitude: 3.4281,
      location: point(6.4476, 3.4281),
      type: HospitalType.PRIVATE,
      total_beds: 120,
      available_beds: 70,
      icu_beds: 12,
      emergency_beds: 20,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.CARDIOLOGY, MedicalSpecialty.NEUROLOGY],
      rating: 4.4,
      total_reviews: 912,
    } as any),({
      name: 'Cedarcrest Hospitals, Ibadan Annex',
      registration_number: 'NG-IBA-CEDAR-021',
      phone_numbers: ['+234-70-1200-0200'],
      email: 'support@cedarcresthospitals.com',
      address: {
        street: 'Ring Road',
        city: 'Ibadan',
        state: 'Oyo',
        country: 'Nigeria',
        postal_code: '200284',
        full_address: 'Ring Road, Ibadan',
      },
      latitude: 7.3775,
      longitude: 3.947,
      location: point(7.3775, 3.947),
      type: HospitalType.PRIVATE,
      total_beds: 85,
      available_beds: 48,
      icu_beds: 9,
      emergency_beds: 16,
      has_emergency: true,
      has_icu: true,
      has_ambulance_service: true,
      specialties: [MedicalSpecialty.GENERAL_SURGERY, MedicalSpecialty.ORTHOPEDICS],
      rating: 4.3,
      total_reviews: 580,
    } as any),
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
      hospital_id: hospitals[2].id,
      current_driver_id: lagosDriver.id,
      type: AmbulanceType.BLS,
      status: AmbulanceStatus.AVAILABLE,
      latitude: 6.451,
      longitude: 3.4302,
      current_location: point(6.451, 3.4302),
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
      hospital_id: hospitals[1].id,
      current_driver_id: ibadanDriver.id,
      type: AmbulanceType.ALS,
      status: AmbulanceStatus.AVAILABLE,
      latitude: 7.4041,
      longitude: 3.9018,
      current_location: point(7.4041, 3.9018),
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
      hospital_id: hospitals[3].id,
      current_driver_id: ibadanDriver.id,
      type: AmbulanceType.BLS,
      status: AmbulanceStatus.AVAILABLE,
      latitude: 7.3788,
      longitude: 3.9452,
      current_location: point(7.3788, 3.9452),
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


