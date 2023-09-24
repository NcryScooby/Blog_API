import { SavedPostsController } from './saved_posts.controller';
import { SavedPostsService } from './saved_posts.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [SavedPostsController],
  providers: [SavedPostsService],
})
export class SavedPostsModule {}
