import { ChallengeStatusEnum } from './ChallengeStatus.enum';

export type Challenge = {
  _id: string;
  challengeDatetime: Date;
  status: keyof typeof ChallengeStatusEnum;
  challengeRequestDatetime: Date;
  challengeResponseDatetime?: Date;
  requester: string;
  category: string;
  match?: string;
  players: string[];
};
