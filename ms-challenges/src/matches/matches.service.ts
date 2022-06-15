import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { Challenge } from 'src/challenges/entities/Challenge';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';
import { Match } from './entities/Match';

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengeInstance();

  async create(match: Match): Promise<Match> {
    try {
      const newMatch = new this.matchModel(match);

      const result = await newMatch.save();
      const matchId = result._id;

      const challenge: Challenge = await lastValueFrom(
        this.clientChallenges.send('get-challenges', {
          playerId: '',
          challengeId: match.challenge,
        }),
      );

      return await lastValueFrom(
        this.clientChallenges.emit('update-challenge-match', {
          matchId: matchId,
          challenge: challenge,
        }),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
