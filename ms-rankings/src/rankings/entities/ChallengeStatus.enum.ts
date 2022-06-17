export enum ChallengeStatusEnum {
  DONE = 'DONE',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DENIED = 'DENIED',
  CANCELED = 'CANCELED',
}

export type ChallengeStatus = keyof typeof ChallengeStatusEnum;
