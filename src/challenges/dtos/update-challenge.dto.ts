import { IsOptional } from 'class-validator';
import { ChallengeStatus } from '../entities/ChallengeStatus.enum';

export class UpdateChallengeDto {
  @IsOptional()
  challengeDatetime?: Date;

  status: ChallengeStatus;
}
