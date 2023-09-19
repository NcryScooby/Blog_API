import { LikesController } from '../../modules/likes/likes.controller';
import { LikesService } from '../../modules/likes/likes.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
