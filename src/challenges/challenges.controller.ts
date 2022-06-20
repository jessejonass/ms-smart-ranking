import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AddMatchToChallengeDto } from './dtos/add-match-to-challenge.dto';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private challengeService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createChallengeDto: CreateChallengeDto) {
    return await this.challengeService.create(createChallengeDto);
  }

  @Post(':challengeId/match')
  async addMatchToChallenge(
    @Body(ValidationPipe) addMatchToChallengeDto: AddMatchToChallengeDto,
    @Param('challengeId') challengeId: string,
  ) {
    return await this.challengeService.addMatchToChallenge(
      addMatchToChallengeDto,
      challengeId,
    );
  }

  @Get()
  async find(@Query('playerId') playerId: string): Promise<any> {
    return await this.challengeService.find(playerId);
  }

  @Put(':challengeId')
  async update(
    @Body() updateChallengeDto: UpdateChallengeDto,
    @Param('challengeId') challengeId: string,
  ): Promise<void> {
    return await this.challengeService.update(updateChallengeDto, challengeId);
  }

  @Delete(':challengeId')
  async delete(@Param('challengeId') challengeId: string): Promise<void> {
    return await this.challengeService.delete(challengeId);
  }
}
