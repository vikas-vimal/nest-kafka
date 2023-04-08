import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Public } from '../decorators/publicRoute.decorator';
import { UserService } from '../services/user.service';

@Controller('user/v1')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Public()
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
    const result = await this.userService.registerNewUser(newUserPayload);
    if (!result) {
      throw new HttpException(
        'Unable to register! Please try again later!',
        400,
      );
    }
    return await this.authService.login(result);
  }

  @Public()
  @Post('login')
  async loginUser(@Body() payload: any) {
    const email = payload.email;
    const password = payload.password;
    const isValidUser = await this.authService.validateUser(email, password);
    const loginResponse = await this.authService.login(isValidUser);
    console.log({ loginResponse });
    return loginResponse;
  }
}
