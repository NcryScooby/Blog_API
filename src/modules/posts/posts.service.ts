import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private readonly PostsRepository: PostsRepository) {}
  async findAll() {
    try {
      const posts = await this.PostsRepository.findAll({
        select: {
          id: true,
          title: true,
          content: true,
          image: true,
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdAt: true,
        },
      });

      if (posts.length === 0) {
        throw new NotFoundException('Posts not found');
      }
      return posts;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAllByCategoryId(categoryId: string) {
    try {
      const posts = await this.PostsRepository.findById({
        where: {
          categoryId,
        },
        select: {
          id: true,
          title: true,
          content: true,
          image: true,
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdAt: true,
        },
      });

      if (posts.length === 0) {
        throw new NotFoundException('Posts not found');
      }

      return posts;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
