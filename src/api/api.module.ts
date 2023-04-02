import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { KafkaController } from './controllers/kafka.controller';
import { UserController } from './controllers/user.controller';
import { KafkaProducerService } from './producers/kafka.producer.service';
import { UserService } from './services/user.service';

@Module({
  controllers: [KafkaController, UserController],
  providers: [KafkaProducerService, UserService, PrismaService],
  imports: [],
})
export class ApiModule {}
