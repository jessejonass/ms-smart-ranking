import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Player } from 'src/players/entities/Player';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';
import { AddMatchToChallengeDto } from './dtos/add-match-to-challenge.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { Challenge } from './entities/Challenge';
import { ChallengeStatusEnum } from './entities/ChallengeStatus.enum';
import { Match } from './entities/Match';

@Injectable()
export class ChallengesService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengeInstance();

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async create(createChallengeDto: CreateChallengeDto): Promise<void> {
    const allPlayers: Player[] = await lastValueFrom(
      this.clientAdminBackend.send('get-players', ''),
    );

    // check requester is a player
    // check request belongs to category informed
    createChallengeDto.players.map((playerDto) => {
      const players: Player[] = allPlayers.filter(
        (player) => String(player._id) === String(playerDto._id),
      );

      if (players.length <= 0) {
        throw new BadRequestException(`${playerDto._id} is not a player`);
      }

      if (String(players[0].category) !== String(createChallengeDto.category)) {
        throw new BadRequestException(
          `This player does not belong to the category informed`,
        );
      }
    });

    // check requester is a match player
    const requester: Player[] = createChallengeDto.players.filter(
      (player) =>
        String(player._id) === String(createChallengeDto.requester._id),
    );

    if (requester.length <= 0) {
      throw new BadRequestException('Requester must be a match player');
    }

    // check category exists
    const category = await lastValueFrom(
      this.clientAdminBackend.send(
        'get-categories',
        createChallengeDto.category,
      ),
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    this.clientChallenges.emit('create-challenge', createChallengeDto);
  }

  async addMatchToChallenge(
    addMatchToChallengeDto: AddMatchToChallengeDto,
    challengeId: string,
  ): Promise<void> {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-challenges', {
        playerId: '',
        _id: challengeId,
      }),
    );

    if (!challenge) {
      throw new NotFoundException(`Challenge not found`);
    }

    if (challenge.status.toUpperCase() === ChallengeStatusEnum.DONE) {
      throw new BadRequestException(`This challenge is done`);
    }

    if (challenge.status.toUpperCase() !== ChallengeStatusEnum.ACCEPTED) {
      throw new BadRequestException(
        `Matches can only be played in challenges accepted by opponents`,
      );
    }

    if (!challenge.players.includes(addMatchToChallengeDto.def)) {
      throw new BadRequestException(
        `The winning player of the match must be part of the challenge!`,
      );
    }

    const match: Match = {};
    match.category = challenge.category;
    match.def = addMatchToChallengeDto.def;
    match.challenge = challengeId;
    match.players = challenge.players;
    match.result = addMatchToChallengeDto.result;

    this.clientChallenges.emit('create-match', match);
  }

  async find(playerId: string): Promise<any> {
    if (playerId) {
      const player: Player = await lastValueFrom(
        this.clientAdminBackend.send('get-players', {
          _id: playerId,
        }),
      );

      if (!player) {
        throw new NotFoundException('Player not found');
      }

      return this.clientChallenges.send('get-challenges', {
        playerId,
        _id: '',
      });
    }
  }

  async update(
    updateChallengeDto: UpdateChallengeDto,
    challengeId: string,
  ): Promise<void> {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-challenges', {
        playerId: '',
        _id: challengeId,
      }),
    );

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (challenge.status !== ChallengeStatusEnum.PENDING) {
      throw new BadRequestException(
        'Only matches with status: PENDING can be updated',
      );
    }

    this.clientChallenges.emit('update-challenge', {
      challengeId: challengeId,
      challenge: updateChallengeDto,
    });
  }

  async delete(challengeId: string): Promise<void> {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-challenges', {
        playerId: '',
        _id: challengeId,
      }),
    );

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    this.clientChallenges.emit('delete-challenge', challenge);
  }
}
