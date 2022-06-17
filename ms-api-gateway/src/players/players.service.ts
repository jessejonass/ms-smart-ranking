import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { AwsService } from 'src/aws/aws.service';
import { ClientProxySmartRanking } from 'src/proxy/client-proxy';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    private clientProxySmartRanking: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

  private clientAdminBackend =
    this.clientProxySmartRanking.getClientProxyAdminBackendInstance();

  async create(createPlayerDto: CreatePlayerDto): Promise<void> {
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

  async uploadFile(file: any, _id: string): Promise<any> {
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

    return await lastValueFrom(
      this.clientAdminBackend.send('get-players', _id),
    );
  }

  async find(_id: string): Promise<any> {
    return await lastValueFrom(
      this.clientAdminBackend.send('get-players', _id ? _id : ''),
    );
  }

  async update(_id: string, updatePlayerDto: UpdatePlayerDto): Promise<void> {
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

  async delete(_id: string): Promise<void> {
    return await lastValueFrom(
      this.clientAdminBackend.emit('delete-player', _id),
    );
  }
}
