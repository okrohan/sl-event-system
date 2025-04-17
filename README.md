# SL Event System


## Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher)
- npm (v7 or higher)


## Running the Application

To run the application, use the following command:

```bash
docker-compose up --build
```

This command will build and start all the services defined in the `docker-compose.yml` file.

A distributed event processing system built with Node.js, Kafka, and MongoDB. This system is designed to handle events with different priorities, provide retry mechanisms, and ensure reliable event delivery.

## Architecture

The system consists of several microservices (Ports as configured in docker-compose):

1. **Event Ingestion Service** (Port: 3000)
   - Entry point for all events
   - Validates and routes events based on priority
   - Stores events updates in MongoDB

2. **Dispatcher Services**
   - Critical Events Dispatcher (Port: 3001, 3002)
     - Handles high-priority events
     - High priority and resource allocation
   - Default Events Dispatcher (Port: 3003)
     - Handles standard priority events
     - Standard priority and resource allocation
   - Retry Events Dispatcher (Port: 3004)
     - Handles events that need retry processing

3. **Retry Service** (Port: 3005)
   - Manages failed events
   - Implements exponential and rule based backoff
   - Routes events back to appropriate queues

4. **Infrastructure**
   - Apache Kafka for event streaming
   - MongoDB for event persistence
   - Docker for containerization
   - Node and express for RESTful server

## Environment Variables

### Kafka Configuration
- `KAFKA_BROKERS`: Kafka broker address (default: kafka:9092)
- `KAFKA_TOPIC`: Kafka topic name

### MongoDB Configuration
- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB_NAME`: Database name

### Service Configuration
- `PORT`: Service port number
- `NODE_ENV`: Environment (development/production)
- `LOG_LEVEL`: Logging level

## API Endpoints

### Event Ingestion Service
- `POST /events`
  ```json
  {
    "eventId": "string",
    "channel": "string",
    "payload": object,
    "metadata": {
      "provider": "string"
    },
    "priority": "CRITICAL" | "DEFAULT"
  }
  ```

### Retry Service
- `POST /replay-dead-letter`
  - Replays events from the dead letter queue

## Monitoring

- MongoDB Express UI: http://localhost:8081
  - Username: admin
  - Password: admin

## Sample Requests
### Dispatch SMS Event
```
curl --location 'localhost:3000/event' \
--header 'Content-Type: application/json' \
--data '{
    "channel": "sms",
    "payload": {
        "message": "Test SMS",
        "phoneNumber": "2025555555"
    },
    "metadata": {

    },
    "priority": "default"
}
'

```

### Replay Dead Lettered Events
```
curl --location 'localhost:3005/replay-dead-letter' \
--header 'Content-Type: application/json' \
--data '{}'
```