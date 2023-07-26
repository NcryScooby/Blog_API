import { PrismaService } from '../prisma.service';
import { type Prisma, Role } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(argsFindMany: Prisma.RoleFindManyArgs): Promise<Role[]> {
    return this.prismaService.role.findMany(argsFindMany);
  }

  findFirst(argsFindFirst: Prisma.RoleFindFirstArgs): Promise<Role> {
    return this.prismaService.role.findFirst(argsFindFirst);
  }

  create(argsCreate: Prisma.RoleCreateArgs): Promise<Role> {
    return this.prismaService.role.create(argsCreate);
  }

  count(argsCount?: Prisma.RoleCountArgs): Promise<number> {
    return this.prismaService.role.count(argsCount);
  }
}
