import {
  BadRequestException,
  NotFoundException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JobsRepository } from 'src/shared/database/repositories/jobs.repositories';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly jobsRepository: JobsRepository) {}
  async findAll({ limit, page, orderBy }: QueryOptions) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const totalCount = await this.jobsRepository.count();

    const jobs = await this.jobsRepository.findMany({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: order,
      },
    });

    if (jobs.length === 0) {
      throw new NotFoundException('No job found');
    }

    return {
      jobs,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async create(createJobDto: CreateJobDto) {
    const { name } = createJobDto;

    const jobNameExists = await this.jobsRepository.findFirst({
      where: { name },
    });

    if (jobNameExists) {
      throw new ConflictException('Job name already exists');
    }

    const job = await this.jobsRepository.create({
      data: {
        name,
      },
    });

    return { job };
  }

  async update(jobId: string, updateJobDto: UpdateJobDto) {
    const { name } = updateJobDto;

    const job = await this.jobsRepository.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const jobNameExists = await this.jobsRepository.findFirst({
      where: { name },
    });

    if (jobNameExists) {
      throw new ConflictException('Job name already exists');
    }

    const updatedJob = await this.jobsRepository.update({
      where: { id: jobId },
      data: {
        name,
      },
    });

    return { job: updatedJob };
  }

  async delete(jobId: string) {
    const job = await this.jobsRepository.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.jobsRepository.delete({ where: { id: jobId } });

    return null;
  }
}
