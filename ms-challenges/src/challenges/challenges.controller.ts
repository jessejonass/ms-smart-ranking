import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ChallengesService } from './challenges.service';
import { Challenge } from './entities/Challenge';

const ackErrors: string[] = ['E11000'];

@Controller()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @EventPattern('create-challenge')
  async create(@Payload() challenge: Challenge, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.challengesService.create(challenge);
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

  @MessagePattern('get-challenges')
  async find(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<Challenge[] | Challenge> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { playerId, _id } = data;
      if (playerId) {
        return await this.challengesService.findChallengeByPlayer(playerId);
      } else if (_id) {
        return await this.challengesService.findById(_id);
      } else {
        return await this.challengesService.find();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('update-challenge')
  async updateChallenge(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const _id: string = data.challengeId;
      const challenge: Challenge = data.challenge;

      await this.challengesService.updateChallenge(_id, challenge);
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

  @EventPattern('update-challenge-match')
  async updateChallengeMatch(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const matchId: string = data.matchId;
      const challenge: Challenge = data.challenge;

      await this.challengesService.updateChallengeMatch(matchId, challenge);
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

  @EventPattern('delete-challenge')
  async delete(@Payload() challenge: Challenge, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.challengesService.delete(challenge);
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
