import { PrismaService } from '@database/prisma.service';
import { SavedPosts, type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SavedPostsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(argsFindMany: Prisma.SavedPostsFindManyArgs): Promise<SavedPosts[]> {
    return this.prismaService.savedPosts.findMany(argsFindMany);
  }

  findFirst(
    argsFindFirst: Prisma.SavedPostsFindFirstArgs,
  ): Promise<SavedPosts | null> {
    return this.prismaService.savedPosts.findFirst(argsFindFirst);
  }

  create(argsCreate: Prisma.SavedPostsCreateArgs): Promise<SavedPosts> {
    return this.prismaService.savedPosts.create(argsCreate);
  }

  delete(argsDelete: Prisma.SavedPostsDeleteArgs): Promise<SavedPosts> {
    return this.prismaService.savedPosts.delete(argsDelete);
  }

  count(argsCount?: Prisma.SavedPostsCountArgs): Promise<number> {
    return this.prismaService.savedPosts.count(argsCount);
  }
}
