import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  find(params: Prisma.PostFindManyArgs) {
    return this.prismaService.post.findMany(params);
  }

  create(data: Prisma.PostCreateArgs) {
    return this.prismaService.post.create(data);
  }

  count(params?: Prisma.PostCountArgs) {
    return this.prismaService.post.count(params);
  }
}
