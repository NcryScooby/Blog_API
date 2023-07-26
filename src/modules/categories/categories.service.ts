import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  async findAll(name: string, { limit, page, orderBy }: QueryOptions) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const totalCount = await this.validateTotalCount(name);

    const categories = await this.categoriesRepository.findAll({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            tags: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                role: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            createdAt: true,
          },
        },
      },
      orderBy: {
        name: order,
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
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            image: true,
            tags: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
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

    const categoryNameExists = await this.categoriesRepository.findByName({
      where: {
        name,
      },
    });

    if (categoryNameExists) {
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

  private async validateTotalCount(name: string) {
    let totalCount = 0;

    if (name) {
      totalCount = await this.categoriesRepository.count({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    } else {
      totalCount = await this.categoriesRepository.count();
    }

    return totalCount;
  }
}
