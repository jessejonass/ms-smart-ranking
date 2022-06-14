import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  getClientProxyAdminBackendInstance(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqp://user:o68wbnCiT1Yf@18.208.114.214:5672/api-smart-ranking',
        ],
        queue: 'admin-backend',
      },
    });
  }
}
