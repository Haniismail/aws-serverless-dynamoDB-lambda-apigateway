import express, { Request, Response, NextFunction } from 'express';
import swaggerUI from 'swagger-ui-express';
import path from 'path';
import Logger from './core/Logger';
import cors from 'cors';
import helmet from 'helmet';
import { corsUrl, environment } from './config/envVar';
import { NotFoundError, ApiError, InternalError } from './core/ApiError';
import routes from './routes';
import { specs } from './docs';

process.on('uncaughtException', (e) => {
  Logger.error(e);
});

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({ 
  origin: corsUrl, 
  optionsSuccessStatus: 200, 
  credentials: true 
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// API Routes
app.use('/api/v1', routes);

// Static files (for S3 uploads if needed)
app.use('/uploads', express.static('uploads'));

// Serve frontend
app.get('/', (req, res) => {
  const frontendPath = path.join(__dirname, '../frontend/index.html');
  res.sendFile(frontendPath);
});

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === 'development') {
      Logger.error(err);
      return res.status(500).send({ status: 'fail', message: err.message });
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
