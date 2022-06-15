import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatusEnum } from '../../challenges/entities/ChallengeStatus.enum';

export class ValidationChallengeStatusPipe implements PipeTransform {
  readonly acceptedStatus = [
    ChallengeStatusEnum.ACCEPTED,
    ChallengeStatusEnum.DENIED,
    ChallengeStatusEnum.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.statusIsValid(status)) {
      throw new BadRequestException(`Status: ${status} is invalid`);
    }

    return value;
  }

  private statusIsValid(status: any) {
    const idx = this.acceptedStatus.indexOf(status);
    return idx !== -1;
  }
}
