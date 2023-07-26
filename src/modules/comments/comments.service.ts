import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from 'src/shared/database/repositories/comments.repositories';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async findCommentByPostId(
    postId: string,
    { limit, page, orderBy }: QueryOptions,
  ) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'desc' : orderBy;

    const postExists = await this.postsRepository.findById({
      where: {
        id: postId,
      },
    });

    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const totalCount = await this.commentsRepository.count({
      where: {
        postId: postId,
      },
    });

    const comments = await this.commentsRepository.findAll({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      where: {
        postId: postId,
      },
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: order,
      },
    });

    return {
      data: comments,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async create(authorId: string, createCommentDto: CreateCommentDto) {
    const { content, postId } = createCommentDto;

    const comment = await this.commentsRepository.create({
      data: {
        content,
        post: {
          connect: {
            id: postId,
          },
        },
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return comment;
  }

  async delete(authorId: string, commentId: string) {
    const commentExists = await this.commentsRepository.findById({
      where: {
        id: commentId,
      },
    });

    if (!commentExists) {
      throw new NotFoundException('Comment not found');
    }

    if (commentExists.authorId !== authorId) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentsRepository.delete({
      where: {
        id: commentId,
      },
    });

    return null;
  }
}
