import { Module } from '@nestjs/common';
import { AwsCognitoConfig } from './aws-cognito.config';
import { AwsCognitoService } from './aws-cognito.service';
import { AwsService } from './aws.service';

@Module({
  providers: [AwsCognitoConfig, AwsCognitoService, AwsService],
  exports: [AwsCognitoConfig, AwsCognitoService, AwsService],
})
export class AwsModule {}
