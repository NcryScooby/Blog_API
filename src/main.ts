import 'dotenv/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import { NestFactory } from '@nestjs/core';
import { env } from '@config/env';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: env.CLIENT_URL,
  });

  await app.listen(env.PORT, '0.0.0.0');
}
bootstrap();
