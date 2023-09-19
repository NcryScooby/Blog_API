import { JobsController } from '../../modules/jobs/jobs.controller';
import { JobsService } from '../../modules/jobs/jobs.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
