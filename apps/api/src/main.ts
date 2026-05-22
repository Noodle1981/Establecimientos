import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Bulletproof .env resolver moving upwards from __dirname
let currentDir = __dirname;
while (currentDir !== path.parse(currentDir).root) {
  const envPath = path.join(currentDir, '.env');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
  currentDir = path.dirname(currentDir);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

// Support BigInt serialization in JSON responses
(BigInt.prototype as any).toJSON = function () {
  const num = Number(this);
  return Number.isSafeInteger(num) ? num : this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Enforce global routing prefix
  app.setGlobalPrefix('api');

  // Enforce strict property validation using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable cookie parser for secured refresh tokens
  app.use(cookieParser());

  // Configure CORS policies matching modern web origins
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`[API Server] Running successfully on: http://localhost:${port}/api`);
}
bootstrap();
