import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Allow frontend on port 8080
  app.enableCors({
    origin: 'http://localhost:8080', // Only allow your frontend during development
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ✅ Enable class-validator pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ API prefix
  app.setGlobalPrefix('api');

  // ✅ Safe parsing of PORT
  const port = parseInt(process.env.PORT ?? '3000', 10);

  // ✅ Listen on all network interfaces so frontend can reach it
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 ERP Backend is running at: http://localhost:${port}/api`);
  console.log(`🌐 Frontend should connect from: http://localhost:8080`);
}

bootstrap();
