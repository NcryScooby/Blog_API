import { PostsRepository } from '@src/shared/database/repositories/posts.repositories';
import { UsersRepository } from '@repositories/users.repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async getUserById(userId: string) {
    const user = await this.usersRepository.findUnique({
      where: { id: userId },
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
    });

    return { user };
  }

  async getUserByUsername(username: string) {
    const user = (await this.usersRepository.findUnique({
      where: { username },
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
        _count: {
          select: { posts: true, comments: true, likes: true },
        },
      },
    })) as User & {
      _count: {
        posts: number;
        comments: number;
        likes: number;
      };
    };

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userWithStatistics = {
      ...user,
      statistics: user._count,
    };
    delete userWithStatistics._count;

    const latestPosts = await this.postsRepository.findMany({
      where: { authorId: user.id },
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

    return { user: userWithStatistics, latestPosts };
  }

  async validateEmail(email: string) {
    const user = await this.usersRepository.findUnique({
      where: { email },
    });

    return { isEmailAvailable: !user };
  }

  async validateUsername(username: string) {
    const user = await this.usersRepository.findUnique({
      where: { username },
    });

    return { isUsernameAvailable: !user };
  }
}
