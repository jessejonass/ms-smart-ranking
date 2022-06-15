import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Match } from './entities/Match';
import { MatchesService } from './matches.service';

const ackErrors: string[] = ['E11000'];

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @EventPattern('create-match')
  async criarPartida(@Payload() match: Match, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.matchesService.create(match);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
