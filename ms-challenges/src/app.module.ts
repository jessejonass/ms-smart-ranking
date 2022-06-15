import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchesModule } from './matches/matches.module';
import { ConfigModule } from '@nestjs/config';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ChallengesModule,
    MatchesModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
