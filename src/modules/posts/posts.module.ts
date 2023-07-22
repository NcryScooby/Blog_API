import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
