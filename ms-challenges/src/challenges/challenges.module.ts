import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProxyModule } from 'src/proxy/proxy.module';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeSchema } from './entities/Challenge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
    ProxyModule,
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
