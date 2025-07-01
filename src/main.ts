import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for your React frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Ambulance & Theatre API')
    .setDescription('API for free ambulances and hospital theatres')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  console.log('DB Host:', process.env.DB_HOST);
  await app.listen(3000);
}
bootstrap();

console.log('DB Host:', process.env.DB_HOST);
console.log('DB Port:', process.env.DB_PORT);
console.log('DB Username:', process.env.DB_USERNAME);
console.log('DB Name:', process.env.DB_NAME);
console.log('DB Password:', process.env.DB_PASSWORD ? '******' : 'Not set');