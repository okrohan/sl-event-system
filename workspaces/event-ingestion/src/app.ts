import express, { Response, RequestHandler, Request } from 'express';
import dotenv from 'dotenv';
import { EventController } from './controllers/eventController';
import { Logger, KafkaService, mongodbService } from '@sl-event-system/shared';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../shared/api-docs/swagger.json';

//Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; //Use the port from environment or fallback to 3000

//Middleware
app.use(express.json());

//Swagger documentation
app.use('/api-docs', swaggerUi.serve as unknown as RequestHandler[]);
app.get('/api-docs', swaggerUi.setup(swaggerDocument) as unknown as RequestHandler);

//Initialize services
async function initializeServices() {
  try {
    //Initialize MongoDB connection
    await mongodbService.connect();
    Logger.info('MongoDB connection established');

    //Initialize Kafka service
    KafkaService.initialize();
    Logger.info('Kafka service initialized');
  } catch (error) {
    Logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

//Initialize services before starting the server
initializeServices()
  .then(() => {
    app.post('/event', EventController.handleEvent as unknown as RequestHandler);
    app.get('/health', ((_req: Request, res: Response) => {
      return res.status(200).json({ status: 'ok', service: 'event-ingestion' });
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
