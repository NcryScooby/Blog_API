import { PostsRepository } from '@repositories/posts.repositories';
import { CreateLikeDto } from '@modules/likes/dto/create-like.dto';
import { LikesRepository } from '@repositories/likes.repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { QueryOptions } from '@interfaces/QueryOptions';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async findLikeByPostId(
    postId: string,
    { limit, page, orderBy }: QueryOptions,
  ) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'desc' : orderBy;

    const postExists = await this.postsRepository.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const totalCount = await this.likesRepository.count({
      where: {
        postId,
      },
    });

    const likes = await this.likesRepository.findMany({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        postId,
      },
      select: {
        id: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: order,
      },
    });

    return {
      likes,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async create(authorId: string, createLikeDto: CreateLikeDto) {
    const { postId } = createLikeDto;

    const postExists = await this.postsRepository.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const likeExists = await this.likesRepository.findFirst({
      where: {
        authorId,
        postId,
      },
    });

    if (likeExists) {
      await this.likesRepository.delete({
        where: {
          id: likeExists.id,
        },
      });

      return {
        message: 'Post Unliked',
      };
    }

    await this.likesRepository.create({
      data: {
        author: {
          connect: { id: authorId },
        },
        post: {
          connect: { id: postId },
        },
      },
    });

    return {
      message: 'Post Liked',
    };
  }
}
