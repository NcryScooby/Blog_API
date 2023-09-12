import { CommentsController } from '@modules/comments/comments.controller';
import { CommentsService } from '@modules/comments/comments.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
