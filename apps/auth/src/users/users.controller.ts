import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto, 'checking user inputs');
    
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  @Get()
  async getUsers() {
    const users = await this.usersService.getUsers();
    return users;
  }
}
