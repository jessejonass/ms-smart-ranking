import {
  BadRequestException,
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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { lastValueFrom, Observable } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

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

  @Post(':_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Param('_id') _id: string) {
    const playerExists = await this.clientAdminBackend.send('get-players', _id);

    if (!playerExists) {
      throw new BadRequestException('Player not found');
    }

    const imageUrl = await this.awsService.uploadFile(file, _id);

    const updatePlayerDto: UpdatePlayerDto = {};
    updatePlayerDto.imageUrl = imageUrl.url;

    await lastValueFrom(
      this.clientAdminBackend.emit('update-player', {
        _id: _id,
        player: updatePlayerDto,
      }),
    );

    return this.clientAdminBackend.send('get-players', _id);
  }

  @Get()
  find(@Query('_id') _id: string): Observable<any> {
    return this.clientAdminBackend.send('get-players', _id ? _id : '');
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('_id') _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    // check category exists sending a event emitter with rmq
    const category = await lastValueFrom(
      this.clientAdminBackend.send('get-categories', updatePlayerDto.category),
    );

    if (category) {
      this.clientAdminBackend.emit('update-player', {
        _id,
        player: updatePlayerDto,
      });
    } else {
      throw new NotFoundException('Category not found');
    }
  }

  @Delete(':_id')
  async delete(@Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
    this.clientAdminBackend.emit('delete-player', _id);
  }
}
