import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class Env {
  @IsString()
  @IsNotEmpty()
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  dbUrl: string;

  @IsString()
  @IsNotEmpty()
  clientUrl: string;

  @IsString()
  @IsNotEmpty()
  awsS3BucketName: string;

  @IsString()
  @IsNotEmpty()
  awsCloudFrontUrl: string;

  @IsString()
  @IsNotEmpty()
  awsAccessKeyId: string;

  @IsString()
  @IsNotEmpty()
  awsSecretAccessKey: string;
}

export const env: Env = plainToInstance(Env, {
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL,
  awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
  awsCloudFrontUrl: process.env.AWS_CLOUDFRONT_URL,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
