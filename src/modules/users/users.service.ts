import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(userId: string) {
    try {
      const user = await this.usersRepository.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
