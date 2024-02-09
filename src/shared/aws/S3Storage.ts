import { StorageEngine } from 'multer';
import { env } from '../config/env';
import { Request } from 'express';
import { S3 } from 'aws-sdk';

export class S3Storage implements StorageEngine {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    });
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error?: any, info?: any) => void,
  ) {
    const filename = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: file.stream,
      ContentType: file.mimetype,
    };

    this.s3.upload(params, (err: any, data: any) => {
      if (err) return cb(err);
      cb(null, {
        filename: filename,
        path: data.Location,
        size: file.size,
      });
    });
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null) => void,
  ) {
    const params = {
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: file.filename.split('/').pop(),
    };

    this.s3.deleteObject(params, function (err) {
      if (typeof cb === 'function') {
        if (err) return cb(err);
        cb(null);
      }
    });
  }
}
