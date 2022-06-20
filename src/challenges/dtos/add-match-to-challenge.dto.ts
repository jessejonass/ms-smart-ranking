import { IsNotEmpty } from 'class-validator';
import { Player } from 'src/players/entities/Player';
import { Result } from '../entities/Result';

export class AddMatchToChallengeDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Result[];
}
