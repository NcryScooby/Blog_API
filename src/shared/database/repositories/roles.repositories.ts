import { PrismaService } from '../prisma.service';
import { type Prisma, Role } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(argsFindMany: Prisma.RoleFindManyArgs): Promise<Role[]> {
    return this.prismaService.role.findMany(argsFindMany);
  }

  findUnique(argsFindUnique: Prisma.RoleFindUniqueArgs): Promise<Role | null> {
    return this.prismaService.role.findUnique(argsFindUnique);
  }

  findFirst(argsFindFirst: Prisma.RoleFindFirstArgs): Promise<Role> {
    return this.prismaService.role.findFirst(argsFindFirst);
  }

  create(argsCreate: Prisma.RoleCreateArgs): Promise<Role> {
    return this.prismaService.role.create(argsCreate);
  }

  update(argsUpdate: Prisma.RoleUpdateArgs): Promise<Role> {
    return this.prismaService.role.update(argsUpdate);
  }

  delete(argsDelete: Prisma.RoleDeleteArgs): Promise<Role> {
    return this.prismaService.role.delete(argsDelete);
  }

  count(argsCount?: Prisma.RoleCountArgs): Promise<number> {
    return this.prismaService.role.count(argsCount);
  }
}
