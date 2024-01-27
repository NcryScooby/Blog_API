import { Global, Module } from '@nestjs/common';
import { S3Storage } from './S3Storage';

@Global()
@Module({
  providers: [S3Storage],
  exports: [S3Storage],
})
export class S3StorageModule {}
