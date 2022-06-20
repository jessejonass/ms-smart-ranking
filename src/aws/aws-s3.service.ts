import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AwsS3Config } from './aws-s3.config';

@Injectable()
export class AwsS3Service {
  constructor(private awsS3Config: AwsS3Config) {}

  public async uploadFile(file: any, _id: string) {
    try {
      const s3 = new AWS.S3({
        region: this.awsS3Config.AWS_REGION,
        accessKeyId: this.awsS3Config.ACCESS_KEY_ID,
        secretAccessKey: this.awsS3Config.ACCESS_SECRET_ACCESS_KEY,
      });

      // file name .png/jpg
      const fileExtension = file.originalname.split('.')[1];

      const urlKey = `${_id}.${fileExtension}`;

      const s3Params = {
        Body: file.buffer,
        Bucket: this.awsS3Config.AWS_S3_BUCKET_NAME,
        Key: urlKey,
      };

      // const imageUrl = s3
      //   .putObject(s3Params)
      //   .promise()
      //   .then(
      //     () => {
      //       return {
      //         url: `https://${this.awsS3Config.AWS_S3_BUCKET_NAME}.s3-${this.awsS3Config.AWS_REGION}.amazonaws.com/${urlKey}`,
      //       };
      //     },
      //     (err) => {
      //       return err;
      //     },
      //   );

      // return imageUrl;

      const result = await s3.putObject(s3Params).promise();
      console.log(result);

      return {
        url: `https://${this.awsS3Config.AWS_S3_BUCKET_NAME}.s3-${this.awsS3Config.AWS_REGION}.amazonaws.com/${urlKey}`,
      };
    } catch (err) {
      throw err.message;
    }
  }
}
