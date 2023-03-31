import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private producer: Producer;
  constructor() {
    const kafka = new Kafka({
      brokers: ['localhost:9092'],
      clientId: 'docker-kafka',
    });
    this.producer = kafka.producer();
    this.producer.connect();
  }

  async publishMessage(topic: string, message: string): Promise<any> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic,
        messages: [{ value: message }],
      });
      return true;
    } catch (error) {
      console.log('Unable to publish message!');
      console.log(error);
      return false;
    }
  }
}
