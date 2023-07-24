import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesRepository } from 'src/shared/database/repositories/roles.repositories';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}
  async findAll(limit: number, page: number) {
    const itemsPerPage = limit || 20;
    const currentPage = page || 1;

    if (itemsPerPage > 20) {
      throw new BadRequestException('Items per page cannot be greater than 20');
    }

    const totalCount = await this.rolesRepository.count();

    const roles = await this.rolesRepository.findAll({
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
      select: {
        id: true,
        name: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (roles.length === 0) {
      throw new NotFoundException('No roles found');
    }

    return {
      data: roles,
      meta: {
        totalCount,
        currentPage,
        totalPages: Math.ceil(totalCount / itemsPerPage),
      },
    };
  }

  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    const roleNameExists = await this.rolesRepository.findByName({
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

    return role;
  }
}
