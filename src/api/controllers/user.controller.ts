import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Controller('user/v1')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async registerUser(@Body() payload: any) {
    const newUserPayload = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      //   isVerified: payload.isVerified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.userService.registerNewUser(newUserPayload);
  }
}
