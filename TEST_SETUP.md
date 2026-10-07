# Quick Test Setup Guide

## Prerequisites
Ensure you have PostgreSQL 16 with PostGIS installed and running locally.

**Don't have PostgreSQL?**
- Download: https://www.postgresql.org/download/windows/
- During installation, note your password and ensure PostGIS is selected

## Step 1: Update Database Credentials
If your local PostgreSQL has different credentials, edit `.env`:
```bash
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Step 2: Create Database

### Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `ambulance_theatre`
4. Click Save
5. Right-click the new database → Query Tool
6. Run: `CREATE EXTENSION IF NOT EXISTS postgis;`

### Using Command Line
**Find psql first**:
```powershell
# Check if psql is in PATH
psql --version

# If not found, add to PATH or use full path, typically:
# C:\Program Files\PostgreSQL\16\bin\psql.exe
```

**Create database**:
```bash
# Connect to PostgreSQL (Windows - replace password if different)
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres

# Or if psql is in PATH:
psql -U postgres

# Then run these SQL commands:
CREATE DATABASE ambulance_theatre;
\c ambulance_theatre
CREATE EXTENSION IF NOT EXISTS postgis;
\q
```

## Step 3: Seed Test Data
```bash
npm run seed:simple
```

This creates:
- 5 users (admin, doctor, nurse, patient, driver)
- 1 hospital (LUTH)
- 2 theatres
- 1 ambulance

## Step 4: Start Server
```bash
npm run start:dev
```

Server will run on **http://localhost:3000**

## Step 5: Access Dashboard
Open your browser and visit:
- **Swagger UI**: http://localhost:3000/api

## Test Credentials
```
Admin:
  Email: admin@hospital.com
  Phone: +2348012345678
  Password: Password123!

Doctor:
  Email: doctor@luth.gov.ng
  Phone: +2348034567890
  Password: Password123!

Driver:
  Email: driver@luth.gov.ng
  Phone: +2348056789012
  Password: Password123!
```

## Quick API Tests via Swagger

1. **Login** (POST /auth/login)
   ```json
   {
     "phone_number": "+2348012345678",
     "password": "Password123!"
   }
   ```
   Copy the returned token.

2. **Authorize** - Click the "Authorize" button in Swagger, paste token

3. **Test Endpoints**:
   - GET /hospitals - View all hospitals
   - GET /theatres - View all theatres
   - GET /ambulances - View all ambulances
   - POST /emergency-requests - Create emergency request

## Check Database Directly

### Using pgAdmin (Recommended for Windows)
1. Open pgAdmin
2. Navigate to: Servers → PostgreSQL 16 → Databases → ambulance_theatre
3. Right-click → Query Tool
4. Run queries:
```sql
-- View tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check data
SELECT * FROM users;
SELECT * FROM hospitals;
```

### Using psql Command Line
```bash
# Full path (adjust version if needed)
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d ambulance_theatre

# Or if in PATH:
psql -U postgres -d ambulance_theatre

# Then run:
\dt                    -- View tables
SELECT * FROM users;   -- Check users
```

## Troubleshooting

### Database Connection Failed
- Ensure PostgreSQL is running: `pg_isready`
- Check credentials in `.env` match your PostgreSQL setup
- Verify database exists: `psql -U postgres -l | grep ambulance_theatre`

### PostGIS Extension Error
```bash
psql -U postgres -d ambulance_theatre -c "CREATE EXTENSION postgis;"
```

### Seed Data Issues
If seeding fails, check TypeScript compilation first:
```bash
npm run build
```

### Port Already in Use
Change PORT in `.env` to 3001 or kill process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
