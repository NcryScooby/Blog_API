import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import { CreatePostDto } from './dto/create-post.dto';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}
  async findAll(limit: number, page: number) {
    const totalCount = await this.postsRepository.count();
    const itemsPerPage = limit || 20;
    const currentPage = page || 1;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const posts = await this.postsRepository.find({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
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
    });

    if (posts.length === 0) {
      throw new NotFoundException('Posts not found');
    }

    if (currentPage > Math.ceil(totalCount / itemsPerPage)) {
      throw new BadRequestException('Page not found');
    }

    return {
      data: posts,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async findAllByCategoryId(categoryId: string, limit: number, page: number) {
    const categoryExists = await this.categoriesRepository.findById({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    const totalCount = await this.postsRepository.count({
      where: {
        categoryId,
      },
    });
    const itemsPerPage = limit || 20;
    const currentPage = page || 1;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const posts = await this.postsRepository.find({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        categoryId,
      },
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
    });

    if (posts.length === 0) {
      throw new NotFoundException('Posts not found');
    }

    if (currentPage > Math.ceil(totalCount / itemsPerPage)) {
      throw new BadRequestException('Page not found');
    }

    return {
      data: posts,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async create(authorId: string, createPostDto: CreatePostDto) {
    const { title, content, image, categoryId } = createPostDto;

    const post = await this.postsRepository.create({
      data: {
        title,
        content,
        image,
        authorId,
        categoryId,
      },
    });

    return post;
  }
}
