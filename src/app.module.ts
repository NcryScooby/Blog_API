import { UsersModule } from './modules/users/users.module';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './shared/database/database.module';

@Module({
  imports: [UsersModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
