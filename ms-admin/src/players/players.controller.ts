import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Player } from './entities/Player';
import { PlayersService } from './players.service';

const ackErrors: string[] = ['E11000'];

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  logger = new Logger(PlayersController.name);

  @EventPattern('create-player')
  async create(@Payload() player: Player, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.log('player:', player);
      await this.playersService.create(player);
      await channel.ack(originalMessage);
    } catch (err) {
      this.logger.error(err);

      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('get-players')
  async find(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (_id) {
        return await this.playersService.findOne(_id);
      } else {
        return await this.playersService.find();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('update-player')
  async updateCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const _id = data._id;
      const player: Player = data.player;

      await this.playersService.update(_id, player);
      await channel.ack(originalMessage);
    } catch (err) {
      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @EventPattern('delete-player')
  async delete(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.playersService.delete(_id);
      await channel.ack(originalMessage);
    } catch (err) {
      const filterAckError = ackErrors.filter((ackError) =>
        err.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }
}
