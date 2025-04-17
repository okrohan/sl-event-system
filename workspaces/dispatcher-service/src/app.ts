import express, { Response, RequestHandler, Request } from 'express';
import dotenv from 'dotenv';
import { Logger, KafkaService, mongodbService, KafkaTopic } from '@sl-event-system/shared';
import { DispatcherController } from './controllers/dispatcherController';

//Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; //Use the port from environment or fallback to 3000

console.log('------START', process.env.PORT);
//Middleware
app.use(express.json());

//Initialize services
async function initializeServices() {
  try {
    //Initialize MongoDB connection
    await mongodbService.connect();
    Logger.info('MongoDB connection established');

    //Initialize Kafka service
    KafkaService.initialize();
    Logger.info('Kafka service initialized');

    KafkaService.registerConsumer(async event => {
      await DispatcherController.processEvent(event);
    }, process.env.KAFKA_TOPIC || KafkaTopic.DEFAULT);
  } catch (error) {
    Logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

//Initialize services before starting the server
initializeServices()
  .then(() => {
    app.get('/health', ((_req: Request, res: Response) => {
      return res.status(200).json({ status: 'ok', service: 'dispatcher-service' });
    }) as unknown as RequestHandler);

    app.listen(port, () => {
      Logger.info(`Event ingestion service running at ${port}`);
      Logger.info(`Swagger documentation available at ${port}/api-docs`);
    });
  })
  .catch(error => {
    Logger.error('Failed to start application:', error);
    process.exit(1);
  });
