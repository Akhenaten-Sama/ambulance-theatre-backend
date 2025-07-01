import { Controller, Get, Post, Put, Delete, Param, Query, Body, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findByEmail(email);
  }

  @Get('by-phone/:phone')
  async findByPhone(@Param('phone') phone: string): Promise<User> {
    return this.userService.findByPhone(phone);
  }

  @Get('admins/all')
  async findAdmins(): Promise<User[]> {
    return this.userService.findAdmins();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<User>): Promise<User> {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.userService.delete(id);
  }
}
