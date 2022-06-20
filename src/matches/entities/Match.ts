import { Document } from 'mongoose';
import { Player } from 'src/common/entities/Player';
import { Result } from './Result';

export class Match extends Document {
  category: string;
  challenge: string;
  players: Player[];
  def: Player;
  result: Result[];
}
