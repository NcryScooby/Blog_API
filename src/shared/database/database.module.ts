import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { UsersRepository } from './repositories/users.repositories';
import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    PostsRepository,
  ],
  exports: [UsersRepository, CategoriesRepository, PostsRepository],
})
export class DatabaseModule {}
