import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const PORT = Number(process.env.APP_PORT);
console.log({ PORT });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT || 3111);
}
bootstrap();
