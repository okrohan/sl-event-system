import express, { Response, RequestHandler, Request } from 'express';
import dotenv from 'dotenv';
import { HealthController } from './src/controllers/healthController';
import { Logger } from '../../shared/logger';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', HealthController.checkHealth as unknown as RequestHandler);

app.listen(port, () => {
  Logger.info(`Retry service running at port ${port}`);
}); 