import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from '@core/swagger/setupSwagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { setupUploads } from './modules/upload/upload.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const configService = app.get(ConfigService);
  setupUploads(app); //upload pic

  app.enableCors({
    origin: [
      configService.get<string>('app.frontendUrl') || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://wegoeverywhere-backend-wtdx.onrender.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // cookie
  });
  setupSwagger(app, configService);

  const port = process.env.PORT || process.env.APP_PORT || configService.get<number>('app.port', 3001);
  await app.listen(port, '0.0.0.0');

  console.log(`Application is running on port ${port}`);
}
bootstrap();
