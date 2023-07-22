import { CategoriesRepository } from './repositories/categories.repositories';
import { UsersRepository } from './repositories/users.repositories';
import { PrismaService } from './prisma.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [PrismaService, UsersRepository, CategoriesRepository],
  exports: [UsersRepository, CategoriesRepository],
})
export class DatabaseModule {}
