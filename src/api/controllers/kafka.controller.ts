import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { KafkaProducerService } from '../producers/kafka.producer.service';

@Controller({
  path: 'api/v1',
  version: '1',
})
export class KafkaController {
  constructor(private producer: KafkaProducerService) {}

  @Get('messages')
  async getAllMessages(@Query('topic') topic: string) {
    if (!topic) {
      throw new BadRequestException({
        message: 'Topic name is missing!',
        data: null,
      });
    }
    console.log('--- fetching from ::', topic);
    const messages: string[] = [];

    return { data: { docs: [messages] } };
  }

  @Post('message')
  async publishNewMessage(
    @Body('topic') topic: string,
    @Body('message') message: string,
  ) {
    if (!topic || !message) {
      throw new BadRequestException({
        message: 'Bad request!',
        data: null,
      });
    }
    console.log('--- publishing to ::', topic, message);
    const sent = await this.producer.publishMessage(
      topic,
      JSON.stringify(message),
    );
    if (!sent) {
      return new HttpException('Something went wrong!', 500);
    }
    return {
      message: 'OK',
      data: {
        topic,
        message,
      },
    };
  }
}
