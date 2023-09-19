import { PrismaService } from '@database/prisma.service';
import { Category, type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(argsFindMany: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    return this.prismaService.category.findMany(argsFindMany);
  }

  findUnique(argsFindUnique: Prisma.CategoryFindUniqueArgs): Promise<Category> {
    return this.prismaService.category.findUnique(argsFindUnique);
  }

  findFirst(argsFindFirst: Prisma.CategoryFindFirstArgs): Promise<Category> {
    return this.prismaService.category.findFirst(argsFindFirst);
  }

  create(argsCreate: Prisma.CategoryCreateArgs): Promise<Category> {
    return this.prismaService.category.create(argsCreate);
  }

  update(argsUpdate: Prisma.CategoryUpdateArgs): Promise<Category> {
    return this.prismaService.category.update(argsUpdate);
  }

  delete(argsDelete: Prisma.CategoryDeleteArgs): Promise<Category> {
    return this.prismaService.category.delete(argsDelete);
  }

  count(argsCount?: Prisma.CategoryCountArgs): Promise<number> {
    return this.prismaService.category.count(argsCount);
  }
}
