import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const MulterUploadImage = FileInterceptor('image', {
  storage: diskStorage({
    destination: './uploads/posts',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
