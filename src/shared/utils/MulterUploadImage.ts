import { FileInterceptor } from '@nestjs/platform-express';
import { S3Storage } from '@src/shared/aws/S3Storage';

export const MulterUploadImage = (path: 'avatar' | 'image') => {
  const fieldName = path;

  return FileInterceptor(fieldName, {
    storage: new S3Storage(),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Only image files are allowed'), false);
      }

      cb(null, true);
    },
  });
};
