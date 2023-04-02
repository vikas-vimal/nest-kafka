import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
type NewUserObj = {
  email: string;
  name: string;
  password: string;
  isVerified?: boolean;
  createdAt?: string;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async registerNewUser(userObj: NewUserObj) {
    try {
      const result = await this.prisma.user.create({
        data: userObj,
      });
      return { data: result };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
