import express, { Response, RequestHandler, Request } from 'express';
import dotenv from 'dotenv';
import { EventController } from './src/controllers/eventController';
import { Logger } from '@shared/logger';
import { KafkaService } from '@shared/kafka';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Use the port from environment or fallback to 3000

// Middleware
app.use(express.json());

// Initialize Kafka service
KafkaService.initialize();

app.post('/event', EventController.handleEvent as unknown as RequestHandler);
app.get('/health', ((_req: Request, res: Response) => {
    return res.status(200).json({ status: 'ok' });
}) as unknown as RequestHandler);

app.listen(port, () => {
  Logger.info(`Event ingestion service running at ${port}`);
  Logger.info(`Swagger documentation available at ${port}/api-docs`);
});
