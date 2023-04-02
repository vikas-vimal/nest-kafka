import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from '../services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid Creadentials!');
    }
    return user;
  }

  async login(user: User): Promise<any> {
    const payload = user;
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    const accessToken = this.jwtService.sign(payload);
    return {
      ...payload,
      accessToken,
    };
  }
}
