import serverlessHttp from 'serverless-http';
import app from './app';

// Wrap the Express app with serverless-http
export const handler = serverlessHttp(app);
