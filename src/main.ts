import 'dotenv/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@src/app.module';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { env } from '@config/env';
import * as path from 'path';
import * as express from 'express';

const server = express();

async function createNestApp() {
  const nestApp = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(server),
  );

  nestApp.useGlobalPipes(new ValidationPipe());
  nestApp.useStaticAssets(path.join(__dirname, '..', './'));
  nestApp.enableCors({
    origin: env.clientUrl,
  });

  await nestApp.init();
}

createNestApp();

export = server;
