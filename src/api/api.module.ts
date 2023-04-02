import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { KafkaController } from './controllers/kafka.controller';
import { PostController } from './controllers/post.controller';
import { UserController } from './controllers/user.controller';
import { JwtAuthGuard } from './guard/jwt.auth.guard';
import { KafkaProducerService } from './producers/kafka.producer.service';
import { PostService } from './services/post.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  controllers: [KafkaController, UserController, PostController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    KafkaProducerService,
    UserService,
    PrismaService,
    AuthService,
    JwtStrategy,
    PostService,
  ],
  exports: [AuthService],
})
export class ApiModule {}
