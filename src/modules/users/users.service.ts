import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUserById(userId: string) {
    return userId;
  }
}
