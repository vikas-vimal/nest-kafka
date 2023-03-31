import { Module } from '@nestjs/common';
import { KafkaController } from './controllers/kafka.controller';
import { KafkaConsumerService } from './producers/kafka.consumer.service';
import { KafkaProducerService } from './producers/kafka.producer.service';

@Module({
  controllers: [KafkaController],
  providers: [KafkaProducerService, KafkaConsumerService],
  imports: [],
})
export class ApiModule {}
