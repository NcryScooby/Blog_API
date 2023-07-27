import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { CommentsRepository } from './repositories/comments.repositories';
import { RolesRepository } from './repositories/roles.repositories';
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
    RolesRepository,
  ],
  exports: [
    UsersRepository,
    CategoriesRepository,
    PostsRepository,
    JobsRepository,
    CommentsRepository,
    LikesRepository,
    RolesRepository,
  ],
})
export class DatabaseModule {}
