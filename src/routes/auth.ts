import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth/index';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
