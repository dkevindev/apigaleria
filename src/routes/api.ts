import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

interface Photo {
  id: number;
  type: 'img' | 'video'; // Adicionando o tipo de mídia
  media: string; // URL da imagem ou vídeo
}

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    cb(null, 'public/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload: multer.Multer = multer({ storage });

const photoDataFilePath = path.join(__dirname, 'photoData.json');

const router = Router();

const readPhotoData = (): Photo[] => {
  try {
    const photoData = fs.readFileSync(photoDataFilePath, 'utf-8');
    return JSON.parse(photoData);
  } catch (error) {
    return [];
  }
};

const writePhotoData = (photos: Photo[]): void => {
  fs.writeFileSync(photoDataFilePath, JSON.stringify(photos, null, 2));
};

router.post('/upload', upload.array('images', 100), (req: Request, res: Response) => {
  try {
    if (req.files) {
      const photos = readPhotoData();
      for (const file of req.files as Express.Multer.File[]) {
        const id = photos.length > 0 ? photos[photos.length - 1].id + 1 : 1;
        const type = file.mimetype.startsWith('video') ? 'video' : 'img'; // Verifica o tipo de mídia
        const media = `http://189.126.111.192:8000/${file.filename}`;
        photos.push({ id, type, media });
      }
      writePhotoData(photos);
    }

    res.json({ success: true, message: 'Mídias enviadas com sucesso!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao enviar mídias.' });
  }
});

router.get('/photos', (req: Request, res: Response) => {
  const photos = readPhotoData();
  res.json(photos);
});

export default router;
