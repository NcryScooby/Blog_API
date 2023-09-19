import { PostsController } from '../../modules/posts/posts.controller';
import { PostsService } from '../../modules/posts/posts.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
