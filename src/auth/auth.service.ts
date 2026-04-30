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

  async register(registerDto: RegisterDto) {
    const userExists = await this.userRepo.findOne({
      where: { phone_number: registerDto.phone_number },
    });
    if (userExists) throw new UnauthorizedException('User already exists');

    const user = this.userRepo.create({
      ...registerDto,
      role:
        registerDto.role === 'admin'
          ? UserRole.SYSTEM_ADMIN
          : registerDto.role === 'driver'
            ? UserRole.DRIVER
            : UserRole.PATIENT,
      password: await bcrypt.hash(registerDto.password, 10),
    });
    await this.userRepo.save(user);

    const token = this.jwtService.sign({ sub: user.id, phone_number: user.phone_number });
    return { token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { phone_number: loginDto.phone_number } });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user.id, phone_number: user.phone_number });
    return { token };
  }
}
import { UserService } from '../user/user.service';
