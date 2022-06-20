import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { Player } from 'src/players/entities/Player';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  challengeDatetime: Date;

  @IsNotEmpty()
  requester: Player;

  @IsNotEmpty()
  category: Player;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Player[];
}
