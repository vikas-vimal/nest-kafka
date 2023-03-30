import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
console.log('NODE_ENV', process.env.NODE_ENV);

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
