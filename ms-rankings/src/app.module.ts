import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingsModule } from './rankings/rankings.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@nestjs-api-smart-rankin.l80zm.mongodb.net/api-smart-ranking-ranking?retryWrites=true&w=majority',
    ),
    RankingsModule,
    ProxyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
