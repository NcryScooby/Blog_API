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
  async create(createCategoryDto: CreateCategoryDto) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoriesRepository.findAll({
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

      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findById(categoryId: string) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(categoryId: string, updateCategoryDto: CreateCategoryDto) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(categoryId: string) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
