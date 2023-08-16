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

    const posts = await this.postsRepository.findMany({
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
            job: true,
            avatar: true,
          },
        },
        createdAt: true,
        views: true,
      },
      orderBy: {
        createdAt: order,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException('Post not found');
    }

    return {
      posts,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async findAllByCategoryId(
    categoryId: string,
    title: string,
    { limit, page, orderBy }: QueryOptions,
  ) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    const totalCount = await this.validateTotalCountByCategoryId(
      title,
      categoryId,
    );

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const categoryExists = await this.categoriesRepository.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

    const posts = await this.postsRepository.findMany({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        categoryId,
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
        likes: true,
        comments: true,
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            job: true,
            avatar: true,
          },
        },
        createdAt: true,
        views: true,
      },
      orderBy: {
        createdAt: order,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException('Post not found');
    }

    return {
      posts,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async findAllByAuthorId(
    authorId: string,
    title: string,
    { limit, page, orderBy }: QueryOptions,
  ) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    const totalCount = await this.validateTotalCountByAuthorId(title, authorId);

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const posts = await this.postsRepository.findMany({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        authorId,
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
        likes: true,
        comments: true,
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            job: true,
            avatar: true,
          },
        },
        createdAt: true,
        views: true,
      },
      orderBy: {
        title: order,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException('Post not found');
    }

    return {
      posts,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async findById(postId: string) {
    const post = await this.postsRepository.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const updatedPost = await this.postsRepository.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        tags: true,
        likes: true,
        category: true,
        comments: {
          select: {
            id: true,
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                job: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            createdAt: true,
            content: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            job: true,
            avatar: true,
          },
        },
        createdAt: true,
        views: true,
      },
    });

    const relatedPosts = await this.postsRepository.findMany({
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
        likes: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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
            avatar: true,
          },
        },
        createdAt: true,
        views: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });

    return {
      post: updatedPost,
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

    return { post };
  }

  async update(authorId: string, postId: string, updatePostDto: UpdatePostDto) {
    const { title, content, tags, categoryId } = updatePostDto;

    const post = await this.postsRepository.findUnique({
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

    return { post: updatedPost };
  }

  async delete(authorId: string, postId: string) {
    const post = await this.postsRepository.findUnique({
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

  private async validateTotalCountByCategoryId(
    title: string,
    categoryId: string,
  ) {
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
      totalCount = await this.postsRepository.count({
        where: {
          categoryId,
        },
      });
    }

    return totalCount;
  }

  private async validateTotalCountByAuthorId(title: string, authorId: string) {
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
      totalCount = await this.postsRepository.count({
        where: {
          authorId,
        },
      });
    }

    return totalCount;
  }
}
