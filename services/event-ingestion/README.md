# Event Ingestion Service

This service is responsible for ingesting events into the system.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   ```

## Development

To run the service in development mode with hot reloading:
```
npm run dev
```

## Building

To build the TypeScript code:
```
npm run build
```

## Production

To start the service in production mode:
```
npm start
```

## API Documentation

The API documentation is built using OpenAPI 3.0 specification. The documentation is organized in the following structure:

```
src/swagger/
├── openapi.json     # Main OpenAPI specification file
├── schemas/         # JSON Schema definitions
│   └── event.json   # Event-related schemas
└── paths/          # API endpoint definitions
    └── event.json  # Event endpoint documentation
```

To update the API documentation:
1. Modify the relevant JSON files in the `src/swagger` directory
2. The changes will be automatically reflected in the Swagger UI

Once the service is running, you can access the Swagger UI documentation at:
```
http://localhost:3000/api-docs
``` 