import { SavedPostsRepository } from '@repositories/saved_posts.repositories';
import { CategoriesRepository } from '@repositories/categories.repositories';
import { CommentsRepository } from '@repositories/comments.repositories';
import { PostsRepository } from '@repositories/posts.repositories';
import { UsersRepository } from '@repositories/users.repositories';
import { RolesRepository } from '@repositories/roles.repositories';
import { LikesRepository } from '@repositories/likes.repositories';
import { JobsRepository } from '@repositories/jobs.repositories';
import { PrismaService } from '@database/prisma.service';
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
    SavedPostsRepository,
  ],
  exports: [
    UsersRepository,
    CategoriesRepository,
    PostsRepository,
    JobsRepository,
    CommentsRepository,
    LikesRepository,
    RolesRepository,
    SavedPostsRepository,
  ],
})
export class DatabaseModule {}
