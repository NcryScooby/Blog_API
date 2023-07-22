import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}
  create(createDto: Prisma.CategoryCreateArgs) {
    return this.prismaService.category.create(createDto);
  }

  findAll(params: Prisma.CategoryFindManyArgs) {
    return this.prismaService.category.findMany(params);
  }

  findById(categoryId: Prisma.CategoryFindUniqueArgs) {
    return this.prismaService.category.findUnique(categoryId);
  }

  findByName(name: Prisma.CategoryFindFirstArgs) {
    return this.prismaService.category.findFirst(name);
  }

  update(params: Prisma.CategoryUpdateArgs) {
    return this.prismaService.category.update(params);
  }

  delete(categoryId: Prisma.CategoryDeleteArgs) {
    return this.prismaService.category.delete(categoryId);
  }

  count(params?: Prisma.CategoryCountArgs) {
    return this.prismaService.category.count(params);
  }
}
