import express, { Response, RequestHandler, Request } from 'express';
import dotenv from 'dotenv';
import { HealthController } from './src/controllers/healthController';
import { Logger } from '@shared/logger';
import { KafkaService, KafkaTopic } from '@shared/kafka';
import { DispatcherController } from './src/controllers/dispatcherController';


// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001; // Use the port from environment or fallback to 3001
console.log(process.env.PORT, process.env.KAFKA_HOST, process.env.KAFKA_TOPIC);

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', HealthController.checkHealth as unknown as RequestHandler);

// Initialize Kafka service
KafkaService.initialize(process.env.KAFKA_HOST, process.env.KAFKA_TOPIC);
KafkaService.registerConsumer(async (event) => {
  await DispatcherController.processEvent(event);
}, process.env.KAFKA_TOPIC || KafkaTopic.DEFAULT);

app.listen(port, () => {
  Logger.info(`Dispatcher service running at port ${port}`);
}); 