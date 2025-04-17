# SL Event System


## Prerequisites

- Docker and Docker Compose
- Node.js (v16 or higher)
- npm (v7 or higher)


## Running the Application

To run the application, use the following command:

```bash
docker-compose up --build
TODO: TO be fixed in docker-compose (Wait for 30 seconds once up for Kafka topics to be configured.and then restart)
docker-compose down 
Restart
docker-compose up --build
```

This command will build and start all the services defined in the `docker-compose.yml` file.

A distributed event processing system built with Node.js, Kafka, and MongoDB. This system is designed to handle events with different priorities, provide retry mechanisms, and ensure reliable event delivery.


## API Endpoints
### Ingestion Service: Dispatch SMS Event
### NOTE: TO Simulate the failure mechanism, uncomment the below line, and rebuild docker-compose 
https://github.com/okrohan/sl-event-system/blob/main/workspaces/dispatcher-service/src/clients/mailgunEmailClient.ts#L9

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

### Replay Service: Replay Dead Lettered Events
```
curl --location 'localhost:3005/replay-dead-letter' \
--header 'Content-Type: application/json' \
--data '{}'
```
## Architecture
### HLD
![arch_diag](https://github.com/user-attachments/assets/0d0d68af-8eab-4128-84b4-6f9f5b026b86)

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
  
### Sequence
#### Event Ingestion
```
API Gateway -> Event Ingestion Service (Enrich, validate event and dispatch message on priority topic)
Dispatcher Service (Dispatch to providers) -> Failure ? Push to Retry Queue -> Success ? Mark Done
Retry Service (Evaluate Retry Logic and BackOff)  (Push back to Dispatcher Service) -> RETRY COUNT EXCEEDED? Mark Deal Lettered

```

## PRD and Tracking

### Ingestion Service
- [x] Add endpoint to ingest data
- [x] Enrich and validate event data
- [x] Push to Kafka Stream based on priority
- [x] Update event document status to MongoDB
- [ ] TODO: Add Open API Docs
- [ ] TDO: CODE Clean UP

### Dispatcher Service
- [x] Consume Event data 
- [x] Enrich and validate event data
- [x] Push to Kafka Stream based on priority
- [x] Validate provider and dispatch event to notification provider
- [x] SYNC: Validate provider dispatch event
- [ ] ASYNC: Validate provider dispatch event for HOOK based async clients
- [x] Dispatch to retry service on notification failure
- [x] Update event document statuses to MongoDB
- [ ] TDO: CODE Clean UP


### Retry Service
- [x] Consume retry events and process
- [x] Setup rule engine to process events by context
- [x] Local setTimeout based backoff logic
- [ ] TODO: Move backedOff logic to a queue
- [x] Add endpoint to replay Dead lettered events
- [ ] TODO: Add Open API Docs
- [ ] TDO: CODE Clean UP




## Monitoring

- MongoDB Express UI: http://localhost:8081
  - Username: admin
  - Password: admin

