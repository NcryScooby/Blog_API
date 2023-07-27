import {
  ParseUUIDPipe,
  Controller,
  HttpStatus,
  HttpCode,
  Param,
  Delete,
  Query,
  Post,
  Body,
  Get,
  Put,
} from '@nestjs/common';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { IsPublic } from 'src/shared/decorators/IsPublic';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @IsPublic()
  findAll(@Query() { limit, page, orderBy }: QueryOptions) {
    return this.jobsService.findAll({ limit, page, orderBy });
  }

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Put(':jobId')
  update(
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(jobId, updateJobDto);
  }

  @Delete(':jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('jobId', ParseUUIDPipe) postId: string) {
    return this.jobsService.delete(postId);
  }
}
