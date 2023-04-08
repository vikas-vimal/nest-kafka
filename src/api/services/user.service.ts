import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash as argonHash, verify as argonVerify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
type NewUserObj = {
  email: string;
  name: string;
  password: string;
  isVerified?: boolean;
  createdAt?: string;
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async registerNewUser(userObj: NewUserObj) {
    try {
      const passwordHash = await argonHash(userObj.password);
      userObj['password'] = passwordHash;
      const user = await this.prisma.user.create({
        data: userObj,
      });
      return user;
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
