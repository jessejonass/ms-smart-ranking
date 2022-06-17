import { ChallengeStatusEnum } from './ChallengeStatus.enum';

export type Challenge = {
  challengeDatetime: Date;
  status: keyof typeof ChallengeStatusEnum;
  challengeRequestDatetime: Date;
  challengeResponseDatetime: Date;
  requester: string;
  category: string;
  players: string[];
  match: string;
};
