import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';

const generateFilename = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) => {
  cb(null, `${Date.now()}-${file.originalname}`);
};

const getFieldNameBasedOnPath = (path: string): string => {
  return path.includes('users') ? 'avatar' : 'image';
};

export const MulterUploadImage = (path: string) => {
  const fieldName = getFieldNameBasedOnPath(path);

  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: `./uploads/${path}`,
      filename: generateFilename,
    }),
  });
};
