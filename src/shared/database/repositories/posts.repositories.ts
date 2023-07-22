import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findAll(params: Prisma.PostFindManyArgs) {
    return this.prismaService.post.findMany(params);
  }

  findById(categoryId: Prisma.PostFindManyArgs) {
    return this.prismaService.post.findMany(categoryId);
  }

  create(data: Prisma.PostCreateArgs) {
    return this.prismaService.post.create(data);
  }
}
