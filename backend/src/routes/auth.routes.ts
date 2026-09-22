import { Router } from 'express';
import { login, register, getMe, loginSchema, registerSchema } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/login', validate({ body: loginSchema }), login);
router.post('/register', validate({ body: registerSchema }), register);
router.get('/me', requireAuth, getMe);

export default router;
