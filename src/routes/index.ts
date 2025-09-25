import { Router } from 'express';
import todoRoutes from './todo';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Serverless Todo API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.STAGE || 'development',
  });
});

// API routes (auth removed)
router.use('/todos', todoRoutes);

export default router;
