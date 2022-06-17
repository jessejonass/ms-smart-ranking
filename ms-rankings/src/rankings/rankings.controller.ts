import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Match } from './entities/Match';
import { RankingResponse } from './entities/RankingResponse';
import { RankingsService } from './rankings.service';

const ackErrors = ['E11000'];

@Controller()
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @EventPattern('proccess-match')
  async proccessMatch(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const matchId: string = data.matchId;
      const match: Match = data.match;

      await this.rankingsService.proccessMatch(matchId, match);

      await channel.ack(originalMessage);
    } catch (err) {
      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('get-rankings')
  async find(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[] | RankingResponse> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { categoryId, dateRef } = data;

      return await this.rankingsService.find(categoryId, dateRef);
    } finally {
      await channel.ack(originalMessage);
    }
  }
}
