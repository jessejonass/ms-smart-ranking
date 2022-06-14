import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly category: string;
}
