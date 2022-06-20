import { Module } from '@nestjs/common';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Config } from './aws-s3.config';

@Module({
  providers: [AwsCognitoConfig, AwsCognitoService, AwsS3Service, AwsS3Config],
  exports: [AwsCognitoConfig, AwsCognitoService, AwsS3Service],
})
export class AwsModule {}
