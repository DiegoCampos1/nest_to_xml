import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

interface Response {
  success: boolean;
  message: string;
}
@Injectable()
export class FileUploadService {
  private readonly logger: Logger = new Logger(FileUploadService.name);

  async uploadXml(xml: any): Promise<Response> {
    const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

    const s3 = new AWS.S3({
      maxRetries: 10,
      retryDelayOptions: {
        base: 150,
      },
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const key = 'martins_xml_default_prod.xml';

    const folder = process.env.AWS_S3_FOLDER;
    const params: AWS.S3.PutObjectRequest = {
      Body: Buffer.from(xml, 'utf8'),
      Bucket: AWS_S3_BUCKET_NAME,
      // ideal ser dinamico o nome da pasta por ambiente

      Key: `${folder}/${key}`,
      ContentEncoding: 'base64',
      ContentType: 'text/xml',
    };

    return new Promise((resolve, reject) => {
      s3.putObject(params, (err) => {
        if (err) {
          const response = {
            success: false,
            message: `Erro ao salvar arquivo no s3`,
          };

          this.logger.error(err);
          return reject(response);
        }
        const response = {
          success: true,
          message: `Arquivo salvo com sucesso: ${key}`,
        };
        return resolve(response);
      });
    });
  }
}
