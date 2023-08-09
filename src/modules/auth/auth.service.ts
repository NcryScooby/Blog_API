import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { RolesRepository } from 'src/shared/database/repositories/roles.repositories';
import { JobsRepository } from 'src/shared/database/repositories/jobs.repositories';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jobsRepository: JobsRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.usersRepository.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user.id, user.roleId);

    return { token };
  }

  async signUp(signUpDto: SignUpDto) {
    const { name, email, password, avatar, jobId } = signUpDto;

    console.log(avatar);

    const emailExists = await this.usersRepository.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    const jobIdExists = await this.jobsRepository.findUnique({
      where: { id: jobId },
      select: { id: true },
    });

    if (!jobIdExists) {
      throw new ConflictException('Job id does not exists');
    }

    const role = await this.rolesRepository.findUnique({
      where: { name: 'USER' },
      select: { id: true },
    });

    const hashedPassword = await hash(password, 10);

    const user = await this.usersRepository.create({
      data: {
        name,
        email,
        password: hashedPassword,
        jobId,
        avatar,
        roleId: role.id,
      },
    });

    const token = await this.generateToken(user.id, user.roleId);

    return { token };
  }

  private async generateToken(userId: string, roleId: string) {
    return this.jwtService.signAsync({
      userId: userId,
      roleId: roleId,
    });
  }
}
