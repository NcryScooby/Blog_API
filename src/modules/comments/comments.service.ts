import { CommentsRepository } from 'src/shared/database/repositories/comments.repositories';
import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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

    const postExists = await this.postsRepository.findUnique({
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

    const comments = await this.commentsRepository.findMany({
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
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: order,
      },
    });

    return {
      comments,
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
            avatar: true,
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

    return { comment };
  }

  async update(
    authorId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const { content } = updateCommentDto;

    const commentExists = await this.commentsRepository.findUnique({
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

    const comment = await this.commentsRepository.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return { comment };
  }

  async delete(authorId: string, commentId: string) {
    const commentExists = await this.commentsRepository.findUnique({
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
