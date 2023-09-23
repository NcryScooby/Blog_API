import { SavedPostsRepository } from '@src/shared/database/repositories/saved_posts.repositories';
import { PostsRepository } from '@src/shared/database/repositories/posts.repositories';
import type { QueryOptions } from '@src/shared/interfaces/QueryOptions';
import { CreateSavedPostDto } from './dto/create-saved-posts.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SavedPostsService {
  constructor(
    private readonly savedPostsRepository: SavedPostsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async findSavedPosts(userId: string, { limit, page, orderBy }: QueryOptions) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'desc' : orderBy;

    const savedPosts = await this.savedPostsRepository.findMany({
      take: itemsPerPage,
      skip: itemsPerPage * (currentPage - 1),
      where: { userId },
      select: {
        post: {
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
        },
      },
      orderBy: { createdAt: order },
    });

    if (savedPosts.length === 0 || !savedPosts) {
      return {
        savedPosts: [],
        meta: {
          totalCount: 0,
          currentPage,
          totalPages: 0,
        },
      };
    }

    const totalCount = await this.savedPostsRepository.count({
      where: {
        userId,
      },
    });

    return {
      savedPosts,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async create(userId: string, createSavedPostDto: CreateSavedPostDto) {
    const { postId } = createSavedPostDto;

    const postExists = await this.postsRepository.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const savedPostExists = await this.savedPostsRepository.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (savedPostExists) {
      await this.savedPostsRepository.delete({
        where: {
          id: savedPostExists.id,
        },
      });

      return {
        message: 'Post Discarded',
      };
    }

    await this.savedPostsRepository.create({
      data: {
        user: {
          connect: { id: userId },
        },
        post: {
          connect: { id: postId },
        },
      },
    });

    return {
      message: 'Post Saved',
    };
  }
}
