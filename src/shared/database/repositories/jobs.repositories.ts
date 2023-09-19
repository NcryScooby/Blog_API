import { PrismaService } from '@database/prisma.service';
import { type Prisma, Job } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JobsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(argsFindMany: Prisma.JobFindManyArgs): Promise<Job[]> {
    return this.prismaService.job.findMany(argsFindMany);
  }

  findUnique(argsFindUnique: Prisma.JobFindUniqueArgs): Promise<Job> {
    return this.prismaService.job.findUnique(argsFindUnique);
  }

  findFirst(argsFindFirst: Prisma.JobFindFirstArgs): Promise<Job> {
    return this.prismaService.job.findFirst(argsFindFirst);
  }

  create(argsCreate: Prisma.JobCreateArgs): Promise<Job> {
    return this.prismaService.job.create(argsCreate);
  }

  update(argsUpdate: Prisma.JobUpdateArgs): Promise<Job> {
    return this.prismaService.job.update(argsUpdate);
  }

  delete(argsDelete: Prisma.JobDeleteArgs): Promise<Job> {
    return this.prismaService.job.delete(argsDelete);
  }

  count(argsCount?: Prisma.JobCountArgs): Promise<number> {
    return this.prismaService.job.count(argsCount);
  }
}
