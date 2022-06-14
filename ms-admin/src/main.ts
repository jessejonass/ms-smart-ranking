import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:o68wbnCiT1Yf@18.208.114.214:5672/api-smart-ranking'],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  await app.listen();
}
bootstrap();
