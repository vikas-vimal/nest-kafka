import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
      console.log(error?.message);
      console.log(error?.meta);
      if (
        error?.code === 'P2002' &&
        error?.meta?.target === 'users_email_key'
      ) {
        throw new BadRequestException('Email address already exists!');
      }
      return false;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const found = this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      console.log({ found });
      return found;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
