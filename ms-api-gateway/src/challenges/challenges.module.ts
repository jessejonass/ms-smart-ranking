import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ChallengesController } from './challenges.controller';

@Module({
  imports: [ProxyModule],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
