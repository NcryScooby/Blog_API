import { FavoritesRepository } from '@src/shared/database/repositories/favorites.repositories';
import { PostsRepository } from '@src/shared/database/repositories/posts.repositories';
import type { QueryOptions } from '@src/shared/interfaces/QueryOptions';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly favoriteRepository: FavoritesRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async findFavorites(userId: string, { limit, page, orderBy }: QueryOptions) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'desc' : orderBy;

    const favorites = await this.favoriteRepository.findMany({
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

    if (favorites.length === 0 || !favorites) {
      throw new NotFoundException('No favorite posts found');
    }

    const totalCount = await this.favoriteRepository.count({
      where: {
        userId,
      },
    });

    return {
      favorites,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async create(userId: string, createFavoriteDto: CreateFavoriteDto) {
    const { postId } = createFavoriteDto;

    const postExists = await this.postsRepository.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const favoriteExists = await this.favoriteRepository.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (favoriteExists) {
      await this.favoriteRepository.delete({
        where: {
          id: favoriteExists.id,
        },
      });

      return {
        message: 'Post Discarded',
      };
    }

    await this.favoriteRepository.create({
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
