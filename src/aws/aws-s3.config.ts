import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Config {
  constructor(private configService: ConfigService) {}

  public AWS_S3_BUCKET_NAME =
    this.configService.get<string>('AWS_S3_BUCKET_NAME');
  public AWS_REGION = this.configService.get<string>('AWS_REGION');
  public ACCESS_KEY_ID = this.configService.get<string>('ACCESS_KEY_ID');
  public ACCESS_SECRET_ACCESS_KEY = this.configService.get<string>(
    'ACCESS_SECRET_ACCESS_KEY',
  );
}
