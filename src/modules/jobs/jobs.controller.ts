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
import { ActiveUserRoleId } from '../../shared/decorators/ActiveUserRoleId';
import { CreateJobDto } from '../../modules/jobs/dto/create-job.dto';
import { UpdateJobDto } from '../../modules/jobs/dto/update-job.dto';
import { JobsService } from '../../modules/jobs/jobs.service';
import { QueryOptions } from '../../shared/interfaces/QueryOptions';
import { IsPublic } from '../../shared/decorators/IsPublic';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @IsPublic()
  findAll(@Query() { limit, page, orderBy }: QueryOptions) {
    return this.jobsService.findAll({ limit, page, orderBy });
  }

  @Post()
  create(
    @ActiveUserRoleId() roleId: string,
    @Body() createJobDto: CreateJobDto,
  ) {
    return this.jobsService.create(createJobDto, roleId);
  }

  @Put(':jobId')
  update(
    @ActiveUserRoleId() roleId: string,
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(jobId, updateJobDto, roleId);
  }

  @Delete(':jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @ActiveUserRoleId() roleId: string,
    @Param('jobId', ParseUUIDPipe) postId: string,
  ) {
    return this.jobsService.delete(postId, roleId);
  }
}
