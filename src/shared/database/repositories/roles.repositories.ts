import { PrismaService } from '@database/prisma.service';
import { Role, type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesRepository {
  constructor(private readonly prismaService: PrismaService) {}
  findUnique(argsFindUnique: Prisma.RoleFindUniqueArgs): Promise<Role> {
    return this.prismaService.role.findUnique(argsFindUnique);
  }
}
