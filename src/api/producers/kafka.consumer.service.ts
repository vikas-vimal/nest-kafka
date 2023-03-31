import { Injectable } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaConsumerService {
  private kafkaConsumer: Consumer;
  constructor() {
    const kafka = new Kafka({
      brokers: ['localhost:9092'],
      clientId: 'docker-kafka',
    });
    this.kafkaConsumer = kafka.consumer({
      groupId: 'docker-kafka-group',
    });
    this.kafkaConsumer.connect();
    this.kafkaConsumer.subscribe({ topic: 'test', fromBeginning: true });
  }

  async listenForMessages(
    topic: string,
    callback: (message: any) => Promise<void>,
  ) {
    await this.kafkaConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(topic, partition, message.value.toString());
        await callback(message.value.toString());
      },
    });
  }

  async closeConnection() {
    await this.kafkaConsumer.disconnect();
  }
}
