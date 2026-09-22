import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { initDb } from './db';
import { ENV } from './config/env';

const app = express();

// --- Security Middleware ---
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// --- CORS Configuration ---
app.use(
  cors({
    origin: [
      ENV.FRONTEND_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 10 minutes',
  },
});
app.use('/api/', limiter);

// --- Request Debugger (matching leave backend) ---
app.use((req, res, next) => {
  console.log(`\n[${new Date().toLocaleTimeString()}] 📥 ${req.method} ${req.url}`);
  if (req.headers.origin) {
    console.log(`🌐 Origin: ${req.headers.origin}`);
  }
  next();
});

// --- Standard Middleware ---
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// --- Static Uploads File Serving ---
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Global Error Handling ---
app.use(errorHandler);

// --- Environment Verification (matching leave backend) ---
function verifyEnv() {
  const required = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD',
    'STUDENT_EMAIL',
    'STUDENT_PASSWORD',
    'JWT_SECRET',
  ];
  console.log('\n🔍 Initializing Environment...');
  required.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`⚠️  Warning: ${key} is not defined in environment variables`);
    } else {
      const val = process.env[key];
      const displayVal =
        key.includes('PASSWORD') || key.includes('SECRET') ? '********' : val;
      console.log(`✅ ${key}: ${displayVal}`);
    }
  });
}

const PORT = ENV.PORT || 5000;

async function startServer() {
  try {
    verifyEnv();
    console.log('\n🏗️  Starting UniSync Campus Competitions API Server...');

    // Initialize Database & sync credentials
    await initDb();

    app.listen(PORT, () => {
      console.log('------------------------------------------------');
      console.log(`🚀 UniSync Campus API is running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📂 Uploads Dir: ${uploadsPath}`);
      console.log('------------------------------------------------\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
