import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  category?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  imageUrl?: string;
}
