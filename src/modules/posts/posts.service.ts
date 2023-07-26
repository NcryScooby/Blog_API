import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';
import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}
  async findAll(title: string, { limit, page, orderBy }: QueryOptions) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const totalCount = await this.validateTotalCount(title);

    const posts = await this.postsRepository.findAll({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        tags: true,
        likes: {
          select: {
            id: true,
            authorId: true,
            createdAt: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            authorId: true,
            createdAt: true,
          },
        },
        category: true,
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
      orderBy: {
        title: order,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException('Post not found');
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

  async findAllByCategoryId(
    categoryId: string,
    { limit, page, orderBy }: QueryOptions,
  ) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

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

    const posts = await this.postsRepository.findAll({
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
        tags: true,
        likes: true,
        comments: true,
        category: true,
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
      orderBy: {
        title: order,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException('Post not found');
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

  async findAllByAuthorId(
    authorId: string,
    { limit, page, orderBy }: QueryOptions,
  ) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const totalCount = await this.postsRepository.count({
      where: {
        authorId,
      },
    });

    const posts = await this.postsRepository.findAll({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        authorId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        tags: true,
        likes: true,
        comments: true,
        category: true,
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
      orderBy: {
        title: order,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException('Post not found');
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

  async findById(postId: string) {
    const post = await this.postsRepository.findById({
      where: {
        id: postId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        tags: true,
        category: true,
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
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const relatedPosts = await this.postsRepository.findAll({
      where: {
        tags: {
          hasSome: post.tags,
        },
        id: {
          not: postId,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        tags: true,
        category: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: post,
      relatedPosts: relatedPosts,
    };
  }

  async create(authorId: string, createPostDto: CreatePostDto) {
    const { title, content, image, tags, categoryId } = createPostDto;

    const post = await this.postsRepository.create({
      data: {
        title,
        content,
        image,
        tags,
        authorId,
        categoryId,
      },
    });

    return post;
  }

  async update(authorId: string, postId: string, updatePostDto: UpdatePostDto) {
    const { title, content, tags, categoryId } = updatePostDto;

    const post = await this.postsRepository.findById({
      where: {
        id: postId,
      },
    });

    if (post.authorId !== authorId) {
      throw new NotFoundException('Post not found');
    }

    const updatedPost = await this.postsRepository.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        tags,
        categoryId,
      },
    });

    return updatedPost;
  }

  async delete(authorId: string, postId: string) {
    const post = await this.postsRepository.findById({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.image) {
      await this.deleteImageFromFolder(post.image);
    }

    if (post.authorId !== authorId) {
      throw new NotFoundException('Post not found');
    }

    await this.postsRepository.delete({
      where: {
        id: postId,
      },
    });
  }

  private async deleteImageFromFolder(image: string) {
    const imagePath = path.join(__dirname, '../../../uploads/posts', image);

    if (fs.existsSync(imagePath)) {
      try {
        await fs.promises.unlink(imagePath);
      } catch (err) {
        console.error('Error deleting image:', err);
      }
    } else {
      console.error('Image not found at:', imagePath);
    }
  }

  private async validateTotalCount(title: string) {
    let totalCount = 0;

    if (title) {
      totalCount = await this.postsRepository.count({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
      });
    } else {
      totalCount = await this.postsRepository.count();
    }

    return totalCount;
  }
}
