import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private logger = new Logger(PlayersController.name);

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<void> {
    // check category exists sending a event emitter with rmq
    const category = await lastValueFrom(
      this.clientAdminBackend.send('get-categories', createPlayerDto.category),
    );

    if (category) {
      this.clientAdminBackend.emit('create-player', createPlayerDto);
    } else {
      throw new NotFoundException('Category not found');
    }
  }

  @Get()
  find(@Query('playerId') playerId: string): Observable<any> {
    return this.clientAdminBackend.send(
      'get-players',
      playerId ? playerId : '',
    );
  }

  @Put(':playerId')
  @UsePipes(ValidationPipe)
  async update(
    @Param(':playerId') playerId: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    // check category exists sending a event emitter with rmq
    const category = await lastValueFrom(
      this.clientAdminBackend.send('get-categories', updatePlayerDto.category),
    );

    if (category) {
      this.clientAdminBackend.emit('update-player', {
        id: playerId,
        player: updatePlayerDto,
      });
    } else {
      throw new NotFoundException('Category not found');
    }
  }

  @Delete('playerId')
  async delete(
    @Param('playerId', ValidationParamsPipe) playerId: string,
  ): Promise<void> {
    this.clientAdminBackend.emit('delete-player', { playerId });
  }
}
