import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(userId: string) {
    const user = await this.usersRepository.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    return { user };
  }
}
