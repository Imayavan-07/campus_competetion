import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const UPLOAD_ROOT = path.resolve(__dirname, '../../uploads');
const IMAGE_DIR = path.join(UPLOAD_ROOT, 'images');
const DOC_DIR = path.join(UPLOAD_ROOT, 'documents');

// Ensure directories exist
[UPLOAD_ROOT, IMAGE_DIR, DOC_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configurations
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, IMAGE_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, `img-${uniqueSuffix}${ext}`);
  },
});

const docStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, DOC_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

// File filters
const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image type. Only JPEG, PNG, WEBP, and SVG are allowed.'));
  }
};

const docFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowedMimes = ['application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid document format. Only PDF files are allowed.'));
  }
};

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

export const uploadPdf = multer({
  storage: docStorage,
  fileFilter: docFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});
