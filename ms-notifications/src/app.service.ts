import { Injectable } from '@nestjs/common';
import { Challenge } from './entities/Challenge';
import { ClientProxySmartRanking } from './proxy/client-proxy';

@Injectable()
export class AppService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  async sendNotificationToOpponent(challenge: Challenge): Promise<void> {
    try {
    } catch (error) {}
  }
}
