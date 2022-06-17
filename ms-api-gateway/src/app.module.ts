import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ProxyModule } from './proxy/proxy.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengesModule } from './challenges/challenges.module';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [
    AwsModule,
    CategoriesModule,
    PlayersModule,
    ProxyModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ChallengesModule,
    RankingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
