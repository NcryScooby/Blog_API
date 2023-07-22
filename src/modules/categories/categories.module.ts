import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
