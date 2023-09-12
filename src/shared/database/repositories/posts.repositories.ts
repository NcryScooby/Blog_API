import { PrismaService } from '@database/prisma.service';
import { Post, type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findMany(argsFindMany: Prisma.PostFindManyArgs): Promise<Post[]> {
    return this.prismaService.post.findMany(argsFindMany);
  }

  findUnique(argsFindUnique: Prisma.PostFindUniqueArgs): Promise<Post> {
    return this.prismaService.post.findUnique(argsFindUnique);
  }

  create(argsCreate: Prisma.PostCreateArgs): Promise<Post> {
    return this.prismaService.post.create(argsCreate);
  }

  update(argsUpdate: Prisma.PostUpdateArgs): Promise<Post> {
    return this.prismaService.post.update(argsUpdate);
  }

  delete(argsDelete: Prisma.PostDeleteArgs): Promise<Post> {
    return this.prismaService.post.delete(argsDelete);
  }

  count(argsCount?: Prisma.PostCountArgs): Promise<number> {
    return this.prismaService.post.count(argsCount);
  }
}
