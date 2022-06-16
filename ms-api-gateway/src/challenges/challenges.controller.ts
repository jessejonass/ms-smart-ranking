import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
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

@Controller('challenges')
export class ChallengesController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientChallenges =
    this.clientProxySmartRanking.getClientProxyChallengeInstance();

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createChallengeDto: CreateChallengeDto) {
    const allPlayers: Player[] = await lastValueFrom(
      this.clientAdminBackend.send('get players', ''),
    );

    // check requester is a player
    // check request belongs to category informed
    createChallengeDto.players.map((playerDto) => {
      const players: Player[] = allPlayers.filter(
        (player) => String(player._id) === String(playerDto._id),
      );

      if (players.length <= 0) {
        throw new BadRequestException(`${playerDto.name} is not a player`);
      }

      if (String(players[0].category) !== String(createChallengeDto.category)) {
        throw new BadRequestException(
          `This player does not belong to the category informed`,
        );
      }
    });

    // check requester is a match player
    const requester: Player[] = createChallengeDto.players.filter(
      (player) => String(player._id) === String(createChallengeDto.requester),
    );

    if (requester.length <= 0) {
      throw new BadRequestException('The requester must be a match player');
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

    await this.clientChallenges.emit('create-challenge', createChallengeDto);
  }

  @Post(':challengeId/match')
  async addMatchToChallenge(
    @Body(ValidationPipe) addMatchToChallengeDto: AddMatchToChallengeDto,
    @Param('challengeId') challengeId: string,
  ) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-challenges', {
        playerId: '',
        challengeId: challengeId,
      }),
    );

    if (!challenge) {
      throw new NotFoundException(`Challenge not found`);
    }

    if (challenge.status === ChallengeStatusEnum.DONE) {
      throw new BadRequestException(`This challenge is done`);
    }

    if (challenge.status !== ChallengeStatusEnum.ACCEPTED) {
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

    await lastValueFrom(this.clientChallenges.emit('create-match', match));
  }

  @Get()
  async find(@Query() playerId: string): Promise<any> {
    if (playerId) {
      const player: Player = await lastValueFrom(
        this.clientAdminBackend.send('get-player', {
          _id: playerId,
        }),
      );

      if (!player) {
        throw new NotFoundException('Player not found');
      }

      return await lastValueFrom(
        this.clientChallenges.send('get-challenges', {
          playerId,
          _id: '',
        }),
      );
    }
  }

  @Put(':challengeId')
  async update(
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Param('challengeId') challengeId: string,
  ) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-challenges', {
        playerId: '',
        _id: challengeId,
      }),
    );

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    if (challenge.status === ChallengeStatusEnum.PENDING) {
      throw new BadRequestException(
        'Only matches with status: PENDING can be updated',
      );
    }

    await this.clientChallenges.emit('update-challenge', {
      challengeId,
      challenge: updateChallengeDto,
    });
  }

  @Delete(':challengeId')
  async delete(@Param('challengeId') challengeId: string) {
    const challenge: Challenge = await lastValueFrom(
      this.clientChallenges.send('get-challenges', {
        idPlayer: '',
        challengeId,
      }),
    );

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    await lastValueFrom(
      this.clientChallenges.emit('delete-challenge', challenge),
    );
  }
}
