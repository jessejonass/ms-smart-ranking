import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  constructor(private configService: ConfigService) {}

  private RABBITMQ_USER = this.configService.get<string>('RABBITMQ_USER');
  private RABBITMQ_PASSWORD =
    this.configService.get<string>('RABBITMQ_PASSWORD');
  private RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');

  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RABBITMQ_URL}`,
        ],
        queue: 'admin-backend',
      },
    });
  }

  getClientProxyChallengeInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RABBITMQ_URL}`,
        ],
        queue: 'challenges',
      },
    });
  }

  getClientProxyRankingInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.RABBITMQ_USER}:${this.RABBITMQ_PASSWORD}@${this.RABBITMQ_URL}`,
        ],
        queue: 'rankings',
      },
    });
  }
}
