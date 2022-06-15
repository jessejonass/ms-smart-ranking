import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(private configService: ConfigService) {}

  private logger = new Logger(AwsService.name);

  public async uploadFile(file: any, _id: string) {
    const AWS_S3_BUCKET_NAME =
      this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const AWS_REGION = this.configService.get<string>('AWS_REGION');
    const ACCESS_KEY_ID = this.configService.get<string>('ACCESS_KEY_ID');
    const ACCESS_SECRET_ACCESS_KEY = this.configService.get<string>(
      'ACCESS_SECRET_ACCESS_KEY',
    );

    const s3 = new AWS.S3({
      region: AWS_REGION,
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: ACCESS_SECRET_ACCESS_KEY,
    });

    // file name .png/jpg
    const fileExtension = file.originalname.split('.')[1];

    const urlKey = `${_id}.${fileExtension}`;
    this.logger.log('urlKey', urlKey);

    const s3Params = {
      Body: file.buffer,
      Bucket: AWS_S3_BUCKET_NAME,
      Key: urlKey,
    };

    const imageUrl = s3
      .putObject(s3Params)
      .promise()
      .then(
        () => {
          return {
            url: `https://${AWS_S3_BUCKET_NAME}.s3-${AWS_REGION}.amazonaws.com/${urlKey}`,
          };
        },
        (err) => {
          this.logger.log('err', err);
          return err;
        },
      );

    return imageUrl;
  }
}
