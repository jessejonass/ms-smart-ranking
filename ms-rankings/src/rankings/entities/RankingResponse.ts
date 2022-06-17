import { MatchHistory } from './MatchHistory';

export type RankingResponse = {
  player?: string;
  position?: number;
  points?: number;
  matchHistory?: MatchHistory;
};
