import { CategoriesController } from '../../modules/categories/categories.controller';
import { CategoriesService } from '../../modules/categories/categories.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
