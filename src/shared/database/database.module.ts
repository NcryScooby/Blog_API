import { CategoriesRepository } from '../../shared/database/repositories/categories.repositories';
import { CommentsRepository } from '../../shared/database/repositories/comments.repositories';
import { PostsRepository } from '../../shared/database/repositories/posts.repositories';
import { UsersRepository } from '../../shared/database/repositories/users.repositories';
import { LikesRepository } from '../../shared/database/repositories/likes.repositories';
import { RolesRepository } from '../../shared/database/repositories/roles.repositories';
import { JobsRepository } from '../../shared/database/repositories/jobs.repositories';
import { PrismaService } from '../../shared/database/prisma.service';
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
