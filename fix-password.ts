import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'ambulance_theatre_db',
  entities: [User],
  synchronize: false,
});

async function fixPassword() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');
    
    const userRepo = AppDataSource.getRepository(User);
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    
    // Update admin user password
    await userRepo.update({ email: 'admin@hospital.com' }, { password: hashedPassword });
    
    console.log('✅ Password updated for admin@hospital.com');
    console.log('You can now login with: admin@hospital.com / Password123!');
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixPassword();
