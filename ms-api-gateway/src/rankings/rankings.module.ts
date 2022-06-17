import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { RankingsController } from './rankings.controller';

@Module({
  imports: [ProxyModule],
  controllers: [RankingsController],
})
export class RankingsModule {}
