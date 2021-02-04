import { exec } from 'child_process';

export const amendoin = (filePath) => {
  console.log('Amendoin chamado');
  console.time('amendoin');
  return new Promise((res, rej) => {
    console.log(
      `Memory Usage: amendoin MB`,
      (Math.round(process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    );
    exec(
      `aws s3 cp ${filePath} s3://${process.env.AWS_S3_BUCKET_NAME}/${process.env.AWS_S3_FOLDER}/ --acl public-read`,
      (err, stdout) => {
        if (err) {
          rej(err);
        }
        console.log(err);
        console.log(stdout);
        res(stdout);
      },
    );
    console.timeEnd('amendoin');
  });
};
