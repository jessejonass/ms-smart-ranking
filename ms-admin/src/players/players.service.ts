import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './entities/Player';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  private async playerExists(_id: string): Promise<Player> {
    const player = await this.playerModel.findOne({ _id }).exec();

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    return player;
  }

  async create(player: Player): Promise<Player> {
    try {
      const newPlayer = new this.playerModel(player);
      return await newPlayer.save();
    } catch (err) {
      this.logger.error(`error: ${JSON.stringify(err.message)}`);
      throw new RpcException(err.message);
    }
  }

  async find(): Promise<Player[]> {
    try {
      return await this.playerModel.find().exec();
    } catch (error) {
      this.logger.error('Error: ', error.message);
      throw new RpcException(error.message);
    }
  }

  async findOne(_id: string): Promise<Player> {
    try {
      return await this.playerExists(_id);
    } catch (error) {
      this.logger.error('Error: ', error.message);
      throw new RpcException(error.message);
    }
  }

  async update(_id: string, player: Player): Promise<void> {
    try {
      await this.playerExists(_id);
      await this.playerModel.findOneAndUpdate({ _id }, { $set: player }).exec();
    } catch (err) {
      this.logger.error(err, err.message);
      throw new RpcException(err.message);
    }
  }

  async delete(_id: string): Promise<void> {
    try {
      await this.playerExists(_id);
      await this.playerModel.findOneAndDelete({ _id }).exec();
    } catch (err) {
      this.logger.error(err, err.message);
      throw new RpcException(err.message);
    }
  }
}
