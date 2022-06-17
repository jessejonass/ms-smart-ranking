import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as momentTimezone from 'moment-timezone';
import { Model } from 'mongoose';
import { Challenge } from './entities/Challenge';
import { ChallengeStatusEnum } from './entities/ChallengeStatus.enum';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  async create(challenge: Challenge): Promise<Challenge> {
    try {
      const newChallenge = new this.challengeModel(challenge);
      newChallenge.challengeRequestDatetime = new Date();

      newChallenge.status = ChallengeStatusEnum.PENDING;
      return await newChallenge.save();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async find(): Promise<Challenge[]> {
    try {
      return await this.challengeModel.find().exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findChallengeByPlayer(playerId: any): Promise<Challenge[] | Challenge> {
    try {
      return await this.challengeModel
        .find()
        .where('players')
        .in(playerId)
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findById(_id: any): Promise<Challenge> {
    try {
      return await this.challengeModel.findOne({ _id }).exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updateChallenge(
    challengeId: string,
    challenge: Challenge,
  ): Promise<void> {
    try {
      challenge.challengeResponseDatetime = new Date();
      await this.challengeModel
        .findOneAndUpdate({ _id: challengeId }, { $set: challenge })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async updateChallengeMatch(
    matchId: string,
    challenge: Challenge,
  ): Promise<void> {
    try {
      challenge.status = ChallengeStatusEnum.DONE;
      challenge.match = matchId;

      await this.challengeModel
        .findOneAndUpdate({ _id: challenge._id }, { $set: challenge })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async delete(challenge: Challenge): Promise<void> {
    try {
      const { _id } = challenge;

      challenge.status = ChallengeStatusEnum.CANCELED;
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: challenge })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findChallengesByDate(categoryId: string, dateRef: string) {
    try {
      const dateRefNew = `${dateRef} 23:59:59.999`;

      return await this.challengeModel
        .find()
        .where('category')
        .equals(categoryId)
        .where('status')
        .equals(ChallengeStatusEnum.DONE)
        .where('challengeDatetime', {
          $lte: momentTimezone(dateRefNew)
            .tz('UTC')
            .format('YYYY-MM-DD HH:mm:ss.SSS+00:00'),
        })
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async findChallengesDone(categoryId: string) {
    try {
      return await this.challengeModel
        .find()
        .where('category')
        .equals(categoryId)
        .where('status')
        .equals(ChallengeStatusEnum.DONE)
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
