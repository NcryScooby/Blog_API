import { SavedPostsModule } from '@modules/saved_posts/saved_posts.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { CommentsModule } from '@modules/comments/comments.module';
import { S3StorageModule } from './shared/aws/s3storage.module';
import { DatabaseModule } from '@database/database.module';
import { PostsModule } from '@modules/posts/posts.module';
import { UsersModule } from '@modules/users/users.module';
import { LikesModule } from '@modules/likes/likes.module';
import { AuthModule } from '@modules/auth/auth.module';
import { JobsModule } from '@modules/jobs/jobs.module';
import { AuthGuard } from '@modules/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    CategoriesModule,
    PostsModule,
    JobsModule,
    CommentsModule,
    LikesModule,
    SavedPostsModule,
    S3StorageModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
