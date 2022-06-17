import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';

@Module({
  imports: [ProxyModule],
  controllers: [RankingsController],
  providers: [RankingsService],
})
export class RankingsModule {}
