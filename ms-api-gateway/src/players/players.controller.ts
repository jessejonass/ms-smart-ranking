import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ValidationParamsPipe } from 'src/common/pipes/validation-params.pipe';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { UpdatePlayerDto } from './dtos/update-player.dto';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private playerService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayerDto: CreatePlayerDto): Promise<void> {
    return await this.playerService.create(createPlayerDto);
  }

  @Post(':_id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: any,
    @Param('_id') _id: string,
  ): Promise<any> {
    return await this.playerService.uploadFile(file, _id);
  }

  @Get()
  async find(@Query('_id') _id: string): Promise<any> {
    return await this.playerService.find(_id);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('_id') _id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<void> {
    return await this.playerService.update(_id, updatePlayerDto);
  }

  @Delete(':_id')
  async delete(@Param('_id', ValidationParamsPipe) _id: string): Promise<void> {
    return await this.playerService.delete(_id);
  }
}
