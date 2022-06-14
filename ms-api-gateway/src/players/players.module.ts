import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ProxyModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
