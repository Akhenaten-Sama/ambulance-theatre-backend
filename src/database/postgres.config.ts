import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'postgres123'),
  database: configService.get<string>('DB_NAME', 'ambulance_theatre'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get<string>('NODE_ENV') !== 'production', // Auto-sync in development only
  logging: configService.get<string>('NODE_ENV') === 'development',
  // PostGIS support - no extra config needed, TypeORM handles geometry types
  extra: {
    max: 20, // Connection pool size
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    statement_timeout: 30000,
    query_timeout: 30000,
  },
});