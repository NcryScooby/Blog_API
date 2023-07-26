import { Like, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(argsFindMany: Prisma.LikeFindManyArgs): Promise<Like[]> {
    return this.prismaService.like.findMany(argsFindMany);
  }

  findOne(argsFindOne: Prisma.LikeFindFirstArgs): Promise<Like | null> {
    return this.prismaService.like.findFirst(argsFindOne);
  }

  create(argsCreate: Prisma.LikeCreateArgs): Promise<Like> {
    return this.prismaService.like.create(argsCreate);
  }

  delete(argsDelete: Prisma.LikeDeleteArgs): Promise<Like> {
    return this.prismaService.like.delete(argsDelete);
  }

  count(argsCount?: Prisma.LikeCountArgs): Promise<number> {
    return this.prismaService.like.count(argsCount);
  }
}
