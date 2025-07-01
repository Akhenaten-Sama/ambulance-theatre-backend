// seed.ts
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './src/user/user.entity';
import { Hospital } from './src/hospital/hospital.entity';
import { Theatre } from './src/theatre/theatre.entity';
import { Ambulance } from './src/ambulance/ambulance.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432, // default to 5432 if undefined
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Hospital, Theatre, Ambulance],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const hospitalRepo = AppDataSource.getRepository(Hospital);
  const theatreRepo = AppDataSource.getRepository(Theatre);
  const ambulanceRepo = AppDataSource.getRepository(Ambulance);

  const password = await bcrypt.hash('password', 10);

  const admin = userRepo.create({
    name: 'Admin User',
    email: 'admin@example.com',
    phone_number: '08000000000',
    password,
    role: 'admin',
    latitude: 6.5244,
    longitude: 3.3792,
  });

  const driver = userRepo.create({
    name: 'Driver One',
    email: 'driver@example.com',
    phone_number: '08011111111',
    password,
    role: 'driver',
    latitude: 6.5344,
    longitude: 3.3892,
  });

  await userRepo.save([admin, driver]);

  const hospital = hospitalRepo.create({
    name: 'Central Hospital',
    latitude: 6.5244,
    longitude: 3.3792,
  });
  await hospitalRepo.save(hospital);

  const theatre = theatreRepo.create({
    hospital,
    specialty: 'Orthopedics',
    available_from: new Date(),
    available_to: new Date(Date.now() + 86400000), // +1 day
    available: true,
  });
  await theatreRepo.save(theatre);

  const ambulance = ambulanceRepo.create({
    driver,
    latitude: driver.latitude,
    longitude: driver.longitude,
    available: true,
  });
  await ambulanceRepo.save(ambulance);

  console.log('✅ Database seeding complete');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding error:', error);
  process.exit(1);
});
