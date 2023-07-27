import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
