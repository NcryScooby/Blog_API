import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  async findAll() {
    try {
      const posts = await this.postsRepository.findAll({
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
      const posts = await this.postsRepository.findById({
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

  async create(authorId: string, createPostDto: CreatePostDto) {
    try {
      const { title, content, image, categoryId } = createPostDto;

      const post = await this.postsRepository.create({
        data: {
          title,
          content,
          image,
          authorId,
          categoryId,
        },
      });

      return post;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
