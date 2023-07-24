import { PostsRepository } from 'src/shared/database/repositories/posts.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { UsersRepository } from './repositories/users.repositories';
import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    PostsRepository,
    RolesRepository,
  ],
  exports: [
    UsersRepository,
    CategoriesRepository,
    PostsRepository,
    RolesRepository,
  ],
})
export class DatabaseModule {}
