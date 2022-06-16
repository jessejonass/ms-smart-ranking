import { Module } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { RankingsController } from './rankings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RankingSchema } from './entities/Ranking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Ranking', schema: RankingSchema }]),
  ],
  providers: [RankingsService],
  controllers: [RankingsController],
})
export class RankingsModule {}
