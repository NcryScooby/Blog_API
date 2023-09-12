import { PrismaService } from '@database/prisma.service';
import { User, type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findUnique(argsFindUnique: Prisma.UserFindUniqueArgs): Promise<User> {
    return this.prismaService.user.findUnique(argsFindUnique);
  }

  create(argsCreate: Prisma.UserCreateArgs): Promise<User> {
    return this.prismaService.user.create(argsCreate);
  }
}
