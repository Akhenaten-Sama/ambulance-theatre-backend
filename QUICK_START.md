# Quick Start Guide - Ambulance & Theatre Backend

## Prerequisites
- Node.js 20+ LTS
- Docker & Docker Compose (for PostgreSQL + PostGIS)
- Git

## Setup Steps

### 1. Clone and Install Dependencies
```bash
# Install dependencies
npm install
```

### 2. Start PostgreSQL with PostGIS (Docker)
```bash
# Start PostgreSQL, Redis, and pgAdmin
docker-compose up -d

# Verify PostGIS is installed
docker exec -it ambulance-postgres psql -U postgres -d ambulance_theatre -c "SELECT PostGIS_Version();"
```

**What's running:**
- PostgreSQL 16 with PostGIS 3.4: `localhost:5432`
- Redis 7: `localhost:6379`
- pgAdmin 4: `http://localhost:5050` (admin@ambulance.com / admin123)

### 3. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings (database is already configured for Docker)
# Minimum required: JWT_SECRET
```

**Default Docker Database Credentials:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123
DB_NAME=ambulance_theatre
```

### 4. Seed the Database
```bash
# Run seed script to create test data
npm run seed
```

**What gets seeded:**
- Admin user: `admin@example.com` / `password`
- Driver: `driver@example.com` / `password`
- Patient: `patient@example.com` / `password`
- 3 Hospitals with theatres
- 2 Ambulances
- Sample emergency requests

### 5. Start the Application
```bash
# Development mode with hot reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### 6. Access the API
- API: `http://localhost:3000`
- Swagger Documentation: `http://localhost:3000/api`
- Health Check: `http://localhost:3000/health`

## Testing the API

### Get JWT Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "08000000000",
    "password": "password"
  }'
```

### Find Nearby Ambulances
```bash
curl -X GET "http://localhost:3000/api/v1/ambulances/nearby?lat=6.5244&lng=3.3792&radius=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Emergency Request
```bash
curl -X POST http://localhost:3000/api/v1/emergency-requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickup_latitude": 6.5244,
    "pickup_longitude": 3.3792,
    "emergency_type": "accident",
    "severity": "urgent",
    "description": "Car accident, need immediate assistance"
  }'
```

## Database Management

### Using pgAdmin
1. Open `http://localhost:5050`
2. Login: `admin@ambulance.com` / `admin123`
3. Add Server:
   - Name: Ambulance DB
   - Host: postgres (container name) or localhost
   - Port: 5432
   - Username: postgres
   - Password: postgres123

### Using psql (Docker)
```bash
# Connect to database
docker exec -it ambulance-postgres psql -U postgres -d ambulance_theatre

# List tables
\dt

# Query users
SELECT id, email, role FROM users;

# Check PostGIS
SELECT postgis_version();
```

## Development Commands

```bash
# Run tests
npm run test

# E2E tests
npm run test:e2e

# Lint
npm run lint

# Format code
npm run format

# Build
npm run build
```

## Stopping Services

```bash
# Stop all Docker containers
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View PostgreSQL logs
docker logs ambulance-postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### PostGIS Not Working
```bash
# Reinstall PostGIS extension
docker exec -it ambulance-postgres psql -U postgres -d ambulance_theatre -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

## Next Steps

1. ✅ Database is running with PostGIS
2. ✅ API is serving requests
3. 📱 Integrate with mobile/web frontend
4. 🔐 Set up external services (Email, SMS, Maps)
5. 🚀 Deploy to production

## Project Structure

```
src/
├── common/              # Shared enums, types, utilities
│   ├── enums/          # All enum definitions
│   ├── types/          # TypeScript interfaces
│   └── utils/          # Helper functions (geospatial, pagination)
├── user/               # User management
├── ambulance/          # Ambulance tracking & management
├── hospital/           # Hospital & facilities
├── theatre/            # Operating theatre management
├── emergency-request/  # Emergency request system
├── booking/            # Theatre booking system
├── notification/       # Notification service
├── auth/               # Authentication & authorization
├── database/           # Database configuration
└── main.ts             # Application entry point
```

## Important Files

- `docker-compose.yml` - Database and services configuration
- `.env.example` - Environment variables template
- `seed.ts` - Database seeding script
- `TECHNICAL_SPEC.md` - Complete technical documentation
- `IMPLEMENTATION_PLAN.md` - Development roadmap

## Support

For issues or questions:
1. Check Swagger documentation: `http://localhost:3000/api`
2. Review `TECHNICAL_SPEC.md` for detailed architecture
3. Check Docker logs: `docker-compose logs`

**Happy coding! 🚑🏥**
