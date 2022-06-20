import { Player } from 'src/players/entities/Player';
import { ChallengeStatusEnum } from './ChallengeStatus.enum';
import { Match } from './Match';

export type Challenge = {
  challengeDatetime: Date;
  status: keyof typeof ChallengeStatusEnum;
  challengeRequestDatetime: Date;
  challengeResponseDatetime: Date;
  requester: Player;
  category: string;
  players: Player[];
  match: Match[];
};
