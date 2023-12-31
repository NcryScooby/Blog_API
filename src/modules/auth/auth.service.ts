import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '@repositories/users.repositories';
import { RolesRepository } from '@repositories/roles.repositories';
import { JobsRepository } from '@repositories/jobs.repositories';
import { SignInDto } from '@modules/auth/dto/signin.dto';
import { SignUpDto } from '@modules/auth/dto/signup.dto';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

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
    const {
      name,
      username,
      email,
      password,
      avatar,
      jobId,
      countryOfBirth,
      bio,
    } = signUpDto;

    const usernameExists = await this.usersRepository.findUnique({
      where: { username },
      select: { id: true },
    });

    if (usernameExists) {
      throw new ConflictException('Username already exists');
    }

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
        username,
        email,
        password: hashedPassword,
        jobId,
        avatar,
        roleId: role.id,
        countryOfBirth,
        bio,
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
