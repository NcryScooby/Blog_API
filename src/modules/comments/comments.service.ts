import { CreateCommentDto } from '@modules/comments/dto/create-comment.dto';
import { UpdateCommentDto } from '@modules/comments/dto/update-comment.dto';
import { CommentsRepository } from '@repositories/comments.repositories';
import { PostsRepository } from '@repositories/posts.repositories';
import { RolesRepository } from '@repositories/roles.repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryOptions } from '@interfaces/QueryOptions';
import { USER_ROLES } from '@constants/user_roles';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly rolesRepository: RolesRepository,
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

  async delete(roleId: string, authorId: string, commentId: string) {
    const commentExists = await this.commentsRepository.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!commentExists) {
      throw new NotFoundException('Comment not found');
    }

    const isUserAdmin = await this.validateIsAdminRole(roleId);

    if (commentExists.authorId !== authorId && !isUserAdmin) {
      throw new NotFoundException('Comment not found');
    }

    await this.commentsRepository.delete({
      where: {
        id: commentId,
      },
    });

    return null;
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
}
