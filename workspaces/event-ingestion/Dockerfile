FROM node:18-alpine

WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript

# First, copy shared directory
COPY shared /app/shared/

# Copy package files and install dependencies
COPY event-ingestion/package*.json ./
RUN npm install

# Copy source code
COPY event-ingestion/ .

# Build shared modules first
RUN cd /app/shared && npm install && npm run build

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"] 