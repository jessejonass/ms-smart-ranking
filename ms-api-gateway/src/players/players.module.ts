import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { ProxyModule } from 'src/proxy/proxy.module';
import { PlayersController } from './players.controller';

@Module({
  imports: [ProxyModule, AwsModule],
  controllers: [PlayersController],
})
export class PlayersModule {}
