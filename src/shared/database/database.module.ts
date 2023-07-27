import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { CommentsRepository } from './repositories/comments.repositories';
import { UsersRepository } from './repositories/users.repositories';
import { LikesRepository } from './repositories/likes.repositories';
import { JobsRepository } from './repositories/jobs.repositories';
import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    PostsRepository,
    JobsRepository,
    CommentsRepository,
    LikesRepository,
  ],
  exports: [
    UsersRepository,
    CategoriesRepository,
    PostsRepository,
    JobsRepository,
    CommentsRepository,
    LikesRepository,
  ],
})
export class DatabaseModule {}
