import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom, Observable } from 'rxjs';
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

  private clientRankings =
    this.clientProxySmartRanking.getClientProxyRankingsInstance();

  async create(match: Match) {
    try {
      const newMatch = new this.matchModel(match);

      const result = await newMatch.save();
      const matchId = result._id;

      const challenge: Challenge = await lastValueFrom(
        this.clientChallenges.send('get-challenges', {
          playerId: '',
          _id: match.challenge,
        }),
      );

      this.clientChallenges.emit('update-challenge-match', {
        matchId: matchId,
        challenge: challenge,
      });

      // send match to ms-rankings
      return this.clientRankings.emit('proccess-match', {
        matchId: matchId,
        match: match,
      });
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
