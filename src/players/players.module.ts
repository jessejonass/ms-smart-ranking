import { Module } from '@nestjs/common';
import { AwsModule } from 'src/aws/aws.module';
import { ProxyModule } from 'src/proxy/proxy.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  imports: [ProxyModule, AwsModule],
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}
