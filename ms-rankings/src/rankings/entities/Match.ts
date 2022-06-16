import { Result } from './Result';

export type Match = {
  category: string;
  challenge: string;
  players: string[];
  def: string;
  result: Result[];
};
