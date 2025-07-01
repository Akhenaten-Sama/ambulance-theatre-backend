import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByPhone(phone: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { phone_number: phone } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAdmins(): Promise<User[]> {
    return this.userRepo.find({ where: { role: 'admin' } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.userRepo.delete(id);
    return { deleted: !!result.affected };
  }
}
