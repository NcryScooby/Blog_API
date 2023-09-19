import { PrismaService } from '@database/prisma.service';
import { Favorite, type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(argsFindMany: Prisma.FavoriteFindManyArgs): Promise<Favorite[]> {
    return this.prismaService.favorite.findMany(argsFindMany);
  }

  findFirst(
    argsFindFirst: Prisma.FavoriteFindFirstArgs,
  ): Promise<Favorite | null> {
    return this.prismaService.favorite.findFirst(argsFindFirst);
  }

  create(argsCreate: Prisma.FavoriteCreateArgs): Promise<Favorite> {
    return this.prismaService.favorite.create(argsCreate);
  }

  delete(argsDelete: Prisma.FavoriteDeleteArgs): Promise<Favorite> {
    return this.prismaService.favorite.delete(argsDelete);
  }

  count(argsCount?: Prisma.FavoriteCountArgs): Promise<number> {
    return this.prismaService.favorite.count(argsCount);
  }
}
