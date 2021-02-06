import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';

interface ResponseUpload {
  success: boolean;
  message: string;
}
@Injectable()
export class FileUploadService {
  private readonly logger: Logger = new Logger(FileUploadService.name);

  async uploadXml(xml: any, id: number): Promise<ResponseUpload> {
    console.log('uploadXml called');
    console.time('uploadXml');

    console.log(
      `Memory Usage: uploadXml MB`,
      (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    );
    const AWS_S3_BUCKET_NAME = `${process.env.AWS_S3_BUCKET_NAME}-${process.env.AWS_S3_FOLDER}`;

    const s3 = new S3({
      maxRetries: 10,
      retryDelayOptions: {
        base: 150,
      },
      params: { AWS_S3_BUCKET_NAME },
      // credentials: {
      //   accessKeyId: process.env.AWS_ACCESS_ID,
      //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      // },
    });

    const key = `products.xml`;

    const params: S3.PutObjectRequest = {
      Body: Buffer.from(xml, 'utf8'),

      Bucket: AWS_S3_BUCKET_NAME,

      Key: `${id}/${key}`,
      ContentEncoding: 'base64',
      ContentType: 'text/xml',
    };

    return new Promise((resolve, reject) => {
      s3.putObject(params, (err) => {
        if (err) {
          const responseError = {
            success: false,
            message: `Erro ao salvar arquivo no s3`,
          };

          this.logger.error(err);
          return reject(responseError);
        }
        const responseSuccess = {
          success: true,
          message: `Arquivo salvo com sucesso: ${key}`,
        };
        console.log(
          `Memory Usage: uploadXml MB`,
          (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
        );
        console.timeEnd('uploadXml');
        return resolve(responseSuccess);
      });
    });
  }
}
