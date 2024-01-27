import {
  BadRequestException,
  NotFoundException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CategoriesRepository } from '@repositories/categories.repositories';
import { UpdatePostDto } from '@modules/posts/dto/update-post.dto';
import { CreatePostDto } from '@modules/posts/dto/create-post.dto';
import { PostsRepository } from '@repositories/posts.repositories';
import { RolesRepository } from '@repositories/roles.repositories';
import type { QueryOptions } from '@interfaces/QueryOptions';
import { S3Storage } from '@src/shared/aws/S3Storage';
import { USER_ROLES } from '@constants/user_roles';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly s3Storage: S3Storage,
  ) {}
  async findAll(title: string, { limit, page, orderBy }: QueryOptions) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const totalCount = await this.validateTotalCount(title);

    const orderCriteria = this.orderCriteria(orderBy);

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
            username: true,
            name: true,
            email: true,
            avatar: true,
            job: {
              select: {
                id: true,
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
            joinedAt: true,
            countryOfBirth: true,
            bio: true,
          },
        },
        createdAt: true,
        views: true,
      },
      orderBy: orderCriteria,
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

    const orderCriteria = this.orderCriteria(orderBy);

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
            username: true,
            name: true,
            email: true,
            avatar: true,
            job: {
              select: {
                id: true,
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
            joinedAt: true,
            countryOfBirth: true,
            bio: true,
          },
        },
        createdAt: true,
        views: true,
      },
      orderBy: orderCriteria,
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

    const totalCount = await this.validateTotalCountByAuthorId(title, authorId);

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const orderCriteria = this.orderCriteria(orderBy);

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
            username: true,
            name: true,
            email: true,
            avatar: true,
            job: {
              select: {
                id: true,
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
            joinedAt: true,
            countryOfBirth: true,
            bio: true,
          },
        },
        createdAt: true,
        views: true,
      },
      orderBy: orderCriteria,
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
                username: true,
                name: true,
                email: true,
                avatar: true,
                job: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                role: {
                  select: {
                    name: true,
                  },
                },
                joinedAt: true,
                countryOfBirth: true,
                bio: true,
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
            username: true,
            name: true,
            email: true,
            avatar: true,
            job: {
              select: {
                id: true,
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
            joinedAt: true,
            countryOfBirth: true,
            bio: true,
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
            username: true,
            name: true,
            email: true,
            avatar: true,
            job: {
              select: {
                id: true,
                name: true,
              },
            },
            role: {
              select: {
                name: true,
              },
            },
            joinedAt: true,
            countryOfBirth: true,
            bio: true,
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

    const categoryExists = await this.categoriesRepository.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

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

    const categoryExists = await this.categoriesRepository.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category not found');
    }

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

  async delete(roleId: string, authorId: string, postId: string) {
    const post = await this.postsRepository.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.image) {
      try {
        const file = { filename: post.image } as Express.Multer.File;
        this.s3Storage._removeFile(null, file, null);
      } catch (err) {
        throw new InternalServerErrorException('Error deleting image from S3');
      }
    }

    const isUserAdmin = await this.validateIsAdminRole(roleId);

    if (post.authorId !== authorId && !isUserAdmin) {
      throw new NotFoundException('Post not found');
    }

    await this.postsRepository.delete({
      where: {
        id: postId,
      },
    });
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

      return totalCount;
    }

    totalCount = await this.postsRepository.count();

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

      return totalCount;
    }

    totalCount = await this.postsRepository.count({
      where: {
        categoryId,
      },
    });

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

      return totalCount;
    }

    totalCount = await this.postsRepository.count({
      where: {
        authorId,
      },
    });

    return totalCount;
  }

  private async validateIsAdminRole(roleId: string) {
    const role = await this.rolesRepository.findUnique({
      where: { id: roleId },
      select: { name: true },
    });

    if (role.name === USER_ROLES.ADMIN) {
      return true;
    }

    return false;
  }

  private orderCriteria(orderBy: string) {
    const orderMappings: Record<string, Prisma.PostOrderByWithRelationInput> = {
      asc: { createdAt: 'asc' },
      desc: { createdAt: 'desc' },
      popularity: { likes: { _count: 'desc' } },
      views: { views: 'desc' },
    };

    const orderCriteria = orderMappings[orderBy] || { createdAt: 'desc' };

    return orderCriteria;
  }
}
