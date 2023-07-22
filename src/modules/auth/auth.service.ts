import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/shared/database/repositories/users.repositories';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  async signin(signInDto: SignInDto) {
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

    const token = await this.generateToken(user.id);

    return { token };
  }

  async signup(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;

    const emailExists = await this.usersRepository.findUnique({
      where: { email },
      select: { id: true },
    });

    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.usersRepository.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = await this.generateToken(user.id);

    return { token };
  }

  private async generateToken(userId: string) {
    return this.jwtService.signAsync({
      sub: userId,
    });
  }
}
