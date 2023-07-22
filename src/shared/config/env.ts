import { IsNotEmpty, IsString, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

class Env {
  @IsString()
  @IsNotEmpty()
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  dbUrl: string;
}

export const env: Env = plainToInstance(Env, {
  dbUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
});

const errors = validateSync(env);

if (errors.length > 0) {
  throw new Error(JSON.stringify(errors, null, 2));
}
