import { PrismaService } from '../prisma.service';
import { Category, type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(argsFindAll: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    return this.prismaService.category.findMany(argsFindAll);
  }

  findById(argsFindById: Prisma.CategoryFindUniqueArgs): Promise<Category> {
    return this.prismaService.category.findUnique(argsFindById);
  }

  findByName(argsFindByName: Prisma.CategoryFindFirstArgs): Promise<Category> {
    return this.prismaService.category.findFirst(argsFindByName);
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
