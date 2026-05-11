import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserRole } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  private toAuthPayload(user: User) {
    const token = this.jwtService.sign({ sub: user.id, phone_number: user.phone_number, email: user.email });
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      status: user.status,
    };
    return {
      token,
      access_token: token,
      user: safeUser,
    };
  }

  async register(registerDto: RegisterDto) {
    const normalizedPhone = registerDto.phone_number?.trim();
    const normalizedEmail = registerDto.email?.trim().toLowerCase();

    if (!normalizedPhone && !normalizedEmail) {
      throw new UnauthorizedException('Email or phone number is required');
    }

    const userExists = await this.userRepo.findOne({
      where: normalizedPhone ? { phone_number: normalizedPhone } : { email: normalizedEmail },
    });
    if (userExists) throw new UnauthorizedException('User already exists');

    const user = this.userRepo.create({
      ...registerDto,
      email: normalizedEmail,
      phone_number: normalizedPhone,
      role:
        registerDto.role === 'admin'
          ? UserRole.SYSTEM_ADMIN
          : registerDto.role === 'driver'
            ? UserRole.DRIVER
            : UserRole.PATIENT,
      password: await bcrypt.hash(registerDto.password, 10),
    });
    await this.userRepo.save(user);

    return this.toAuthPayload(user);
  }

  async login(loginDto: LoginDto) {
    const normalizedPhone = loginDto.phone_number?.trim();
    const normalizedEmail = loginDto.email?.trim().toLowerCase();

    const user = await this.userRepo.findOne({
      where: normalizedPhone ? { phone_number: normalizedPhone } : { email: normalizedEmail },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.toAuthPayload(user);
  }
}
