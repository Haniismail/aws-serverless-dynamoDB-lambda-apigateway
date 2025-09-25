export const environment = process.env.NODE_ENV || process.env.STAGE || 'development';
export const port = process.env.PORT || '3000';
export const region = process.env.REGION || 'us-east-1';
export const stage = process.env.STAGE || 'dev';

export const dynamodb = {
  tableName: process.env.DYNAMODB_TABLE || 'serverless-todo-api-dev',
  region: process.env.REGION || 'us-east-1',
};

export const corsUrl = process.env.CORS_ORIGIN || '*';

export const tokenInfo = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  issuer: process.env.TOKEN_ISSUER || 'serverless-todo-api',
  audience: process.env.TOKEN_AUDIENCE || 'serverless-todo-api-users',
};

export const aws = {
  region: process.env.REGION || 'us-east-1',
  s3Bucket: process.env.S3_BUCKET || 'serverless-todo-api-dev-uploads',
};

export const email = {
  from: process.env.EMAIL_FROM || 'noreply@todo-api.com',
  region: process.env.REGION || 'us-east-1',
};
