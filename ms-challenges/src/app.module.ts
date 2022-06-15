import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from './challenges/challenges.module';
import { MatchesModule } from './matches/matches.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@nestjs-api-smart-rankin.l80zm.mongodb.net/api-smart-ranking-challenges?retryWrites=true&w=majority',
    ),
    ChallengesModule,
    MatchesModule,
    ProxyModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
