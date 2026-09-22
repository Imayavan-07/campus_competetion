import { Router } from 'express';
import { uploadImage, uploadPdf } from '../middleware/upload';
import { uploadImageHandler, uploadPdfHandler } from '../controllers/uploadController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Allow authenticated users to upload files
router.post('/image', requireAuth, uploadImage.single('file'), uploadImageHandler);
router.post('/pdf', requireAuth, uploadPdf.single('file'), uploadPdfHandler);

export default router;
