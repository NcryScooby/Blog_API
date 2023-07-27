import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RolesRepository } from 'src/shared/database/repositories/roles.repositories';
import { QueryOptions } from 'src/shared/interfaces/QueryOptions';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}
  async findAll({ limit, page, orderBy }: QueryOptions) {
    const itemsPerPage = Number(limit) || 20;
    const currentPage = Number(page) || 1;
    const order = orderBy !== 'asc' && orderBy !== 'desc' ? 'asc' : orderBy;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const totalCount = await this.rolesRepository.count();

    const roles = await this.rolesRepository.findMany({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: order,
      },
    });

    if (roles.length === 0) {
      throw new NotFoundException('No roles found');
    }

    return {
      roles,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    const roleNameExists = await this.rolesRepository.findFirst({
      where: { name },
    });

    if (roleNameExists) {
      throw new ConflictException('Role name already exists');
    }

    const role = await this.rolesRepository.create({
      data: {
        name,
      },
    });

    return { role };
  }
}
