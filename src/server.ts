import Logger from './core/Logger';
import { port, environment } from './config/envVar';
import app from './app';

// Only start the server if not running in Lambda
if (process.env.AWS_LAMBDA_FUNCTION_NAME === undefined) {
  app
    .listen(port, () => {
      console.log(`server running on port: ${port} in ${environment} mode ✅`);
      console.log(`API Documentation available at http://localhost:${port}/api-docs`);
    })
    .on('error', (e) => {
      console.log((e));
    });
}

export default app;
