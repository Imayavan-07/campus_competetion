import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    HOST: process.env.DB_HOST || '127.0.0.1',
    PORT: parseInt(process.env.DB_PORT || '3306', 10),
    USER: process.env.DB_USER || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    NAME: process.env.DB_NAME || 'unisync_campus',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || 'unisync_super_secret_jwt_encryption_key_2026!',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  },
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '15', 10),
  ADMIN: {
    NAME: process.env.ADMIN_NAME || 'Chief Administrator',
    EMAIL: process.env.ADMIN_EMAIL || 'admin@university.edu',
    PASSWORD: process.env.ADMIN_PASSWORD || 'Admin@123456',
  },
  STUDENT: {
    NAME: process.env.STUDENT_NAME || 'Alex Vance',
    EMAIL: process.env.STUDENT_EMAIL || 'student@university.edu',
    PASSWORD: process.env.STUDENT_PASSWORD || 'Student@123456',
  },
  CLUB_LEAD: {
    NAME: process.env.CLUB_LEAD_NAME || 'Bob Smith',
    EMAIL: process.env.CLUB_LEAD_EMAIL || 'club.lead@university.edu',
    PASSWORD: process.env.CLUB_LEAD_PASSWORD || 'Club@123456',
  },
};
