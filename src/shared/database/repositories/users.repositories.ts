import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findUnique(findUniqueDto: Prisma.UserFindUniqueArgs) {
    return this.prismaService.user.findUnique(findUniqueDto);
  }

  create(createDto: Prisma.UserCreateArgs) {
    return this.prismaService.user.create(createDto);
  }
}
