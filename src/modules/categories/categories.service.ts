import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  async findAll(limit: number, page: number) {
    const totalCount = await this.categoriesRepository.count();
    const itemsPerPage = limit || 20;
    const currentPage = page || 1;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const categories = await this.categoriesRepository.findAll({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      select: {
        id: true,
        name: true,
        Post: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            category: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    if (categories.length === 0) {
      throw new BadRequestException('Category not found');
    }

    return {
      data: categories,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async findById(categoryId: string) {
    const category = await this.categoriesRepository.findById({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
        Post: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            category: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    const categoryExists = await this.categoriesRepository.findByName({
      where: {
        name,
      },
    });

    if (categoryExists) {
      throw new ConflictException('Category name already exists');
    }

    const category = await this.categoriesRepository.create({
      data: {
        name,
      },
    });

    return category;
  }

  async update(categoryId: string, updateCategoryDto: CreateCategoryDto) {
    const { name } = updateCategoryDto;

    const categoryExists = await this.categoriesRepository.findById({
      where: {
        id: categoryId,
      },
      select: {
        id: true,
        name: true,
        Post: true,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    const categoryNameExists = await this.categoriesRepository.findByName({
      where: {
        name,
      },
    });

    if (categoryNameExists) {
      throw new ConflictException('Category name already exists');
    }

    const category = await this.categoriesRepository.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!category) {
      throw new InternalServerErrorException('Category not updated');
    }

    return category;
  }

  async delete(categoryId: string) {
    const categoryExists = await this.categoriesRepository.findById({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    const category = await this.categoriesRepository.delete({
      where: {
        id: categoryId,
      },
    });

    return category;
  }
}
