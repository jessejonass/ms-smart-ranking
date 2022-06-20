import { Player } from 'src/players/entities/Player';
import { Result } from './Result';

export type Match = {
  category?: string;
  challenge?: string;
  players?: Player[];
  def?: Player;
  result?: Result[];
};
