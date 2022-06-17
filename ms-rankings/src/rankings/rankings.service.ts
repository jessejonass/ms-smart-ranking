import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import * as momentTimezone from 'moment-timezone';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';
import { Category } from './entities/Category';
import { Challenge } from './entities/Challenge';
import { EventsName } from './entities/EventsName.enum';
import { Match } from './entities/Match';
import { MatchHistory } from './entities/MatchHistory';
import { Ranking } from './entities/Ranking.schema';
import { RankingResponse } from './entities/RankingResponse';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('Ranking') private readonly rankingModel: Model<Ranking>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  private clientChallengeBackend =
    this.clientProxySmartRanking.getClientProxyChallengeInstance();

  async proccessMatch(matchId: string, match: Match): Promise<void> {
    try {
      const category: Category = await lastValueFrom(
        this.clientAdminBackend.send('get-categories', match.category),
      );

      await Promise.all(
        match.players.map(async (player) => {
          const ranking = new this.rankingModel();

          ranking.category = match.category;
          ranking.challenge = match.challenge;
          ranking.match = matchId;
          ranking.player = player;

          // winner and loser
          if (String(player) === String(match.def)) {
            const eventFilter = category.events.filter(
              (event) => event.name.toUpperCase() === EventsName.VICTORY,
            );

            ranking.event = EventsName.VICTORY;
            ranking.operation = eventFilter[0].operation;
            ranking.points = eventFilter[0].value;
          } else {
            const eventFilter = category.events.filter(
              (event) => event.name.toUpperCase() === EventsName.DEFEAT,
            );

            ranking.event = EventsName.DEFEAT;
            ranking.operation = eventFilter[0].operation;
            ranking.points = eventFilter[0].value;
          }

          await ranking.save();
        }),
      );
    } catch (err) {
      throw new RpcException(err.message);
    }
  }

  async find(
    categoryId: string,
    dateRef: string,
  ): Promise<RankingResponse[] | RankingResponse> {
    try {
      if (!dateRef) {
        dateRef = momentTimezone().tz('America/Sao_Paulo').format('YYYY-MM-DD');
      }

      // matches register with category filter
      const rankingRegisters = await this.rankingModel
        .find()
        .where('category')
        .equals(categoryId)
        .exec();

      // challenges with date filter (<= dateRef)
      // status DONE and filter category
      const challenges: Challenge[] = await lastValueFrom(
        this.clientChallengeBackend.send('get-challenges-done', {
          categoryId: categoryId,
          dateRef: dateRef,
        }),
      );

      // loop ranking registers
      // discard registers not found in challenges
      _.remove(rankingRegisters, function (item: Ranking) {
        return (
          challenges.filter((challenge) => challenge._id == item.challenge)
            .length == 0
        );
      });

      // group by players
      const result = _(rankingRegisters)
        .groupBy('player')
        .map((items, key) => ({
          player: key,
          history: _.countBy(items, 'event'),
          points: _.sumBy(items, 'points'),
        }))
        .value();

      const ordenedResult = _.orderBy(result, 'points', 'desc');

      const rankingResponseList: RankingResponse[] = [];

      ordenedResult.map((item, index) => {
        const rankingResponse: RankingResponse = {};
        rankingResponse.player = item.player;
        rankingResponse.position = index + 1;
        rankingResponse.points = item.points;

        const matchHistory: MatchHistory = {};
        matchHistory.victories = item.history.VICTORY
          ? item.history.VICTORY
          : 0;
        matchHistory.defeats = item.history.DEFEAT ? item.history.DEFEAT : 0;

        rankingResponse.matchHistory = matchHistory;
        rankingResponseList.push(rankingResponse);
      });

      return rankingResponseList;
    } catch (err) {
      throw new RpcException(err.message);
    }
  }
}
