import { Request, Response } from 'express';
import { ENV } from '../config/env';

export function uploadImageHandler(req: Request, res: Response): void {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No image file uploaded.' });
    return;
  }

  const relativePath = `/uploads/images/${req.file.filename}`;
  const fullUrl = `http://localhost:${ENV.PORT}${relativePath}`;

  res.status(201).json({
    success: true,
    message: 'Image successfully uploaded and stored on local server.',
    data: {
      url: relativePath,
      fullUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
}

export function uploadPdfHandler(req: Request, res: Response): void {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
    return;
  }

  const relativePath = `/uploads/documents/${req.file.filename}`;
  const fullUrl = `http://localhost:${ENV.PORT}${relativePath}`;

  res.status(201).json({
    success: true,
    message: 'PDF document successfully uploaded and stored on local server.',
    data: {
      url: relativePath,
      fullUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
}
