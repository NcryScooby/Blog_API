import 'dotenv/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import { NestFactory } from '@nestjs/core';
import { env } from '@config/env';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(path.join(__dirname, '..', './'));
  app.enableCors({
    origin: env.clientUrl,
  });

  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
