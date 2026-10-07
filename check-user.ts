import { DataSource } from 'typeorm';
import { User } from './src/user/user.entity';
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

async function checkUser() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');
    
    const userRepo = AppDataSource.getRepository(User);
    
    // Check for admin user
    const adminUser = await userRepo.findOne({ where: { email: 'admin@hospital.com' } });
    
    if (adminUser) {
      console.log('\n✅ User found:');
      console.log('Email:', adminUser.email);
      console.log('Name:', adminUser.name);
      console.log('Role:', adminUser.role);
      console.log('Phone:', adminUser.phone_number);
      console.log('Password hash (first 30 chars):', adminUser.password?.substring(0, 30));
    } else {
      console.log('\n❌ User admin@hospital.com NOT FOUND');
      
      // List all users
      const allUsers = await userRepo.find();
      console.log(`\nTotal users in database: ${allUsers.length}`);
      allUsers.forEach(u => {
        console.log(`- ${u.email} (${u.name}) - Role: ${u.role}`);
      });
    }
    
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUser();
