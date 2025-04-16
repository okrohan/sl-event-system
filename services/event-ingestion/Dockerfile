# Use Node.js official image as the base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript

# Copy package files and install dependencies
COPY package*.json /app/
COPY shared/package*.json /app/shared/
COPY services/event-ingestion/package*.json /app/services/event-ingestion/

# Install dependencies
RUN npm install
RUN cd shared && npm install
RUN cd services/event-ingestion && npm install

# Copy source code
COPY shared /app/shared/
COPY services/event-ingestion /app/services/event-ingestion/

# Build shared modules first
RUN cd shared && npm run build

# Build the application
WORKDIR /app/services/event-ingestion
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
