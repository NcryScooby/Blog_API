import { UsersRepository } from '@repositories/users.repositories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '@src/shared/database/repositories/posts.repositories';

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
    const user = await this.usersRepository.findUnique({
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
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const lastPosts = await this.postsRepository.findMany({
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

    return { user, lastPosts };
  }
}
