import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RolesRepository } from 'src/shared/database/repositories/roles.repositories';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}
  async findAll(name: string, { limit, page, orderBy }: QueryOptions) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const totalCount = await this.validateTotalCount(name);

    const categories = await this.categoriesRepository.findMany({
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
                job: {
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
      categories,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async findById(categoryId: string) {
    const category = await this.categoriesRepository.findUnique({
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
                job: true,
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

    return { category };
  }

  async create(createCategoryDto: CreateCategoryDto, roleId: string) {
    await this.validateIsAdminRole(roleId);

    const { name } = createCategoryDto;

    const categoryNameExists = await this.categoriesRepository.findFirst({
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

    return { category };
  }

  async update(
    categoryId: string,
    updateCategoryDto: CreateCategoryDto,
    roleId: string,
  ) {
    await this.validateIsAdminRole(roleId);
    const { name } = updateCategoryDto;

    const categoryExists = await this.categoriesRepository.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    const categoryNameExists = await this.categoriesRepository.findFirst({
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

    return { category };
  }

  async delete(categoryId: string, roleId: string) {
    await this.validateIsAdminRole(roleId);
    const categoryExists = await this.categoriesRepository.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    await this.categoriesRepository.delete({
      where: {
        id: categoryId,
      },
    });

    return null;
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

  private async validateIsAdminRole(roleId: string) {
    const role = await this.rolesRepository.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    if (role.name !== 'ADMIN') {
      throw new UnauthorizedException();
    }
  }
}
