FROM node:18-alpine

WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript

# First, copy shared directory
COPY shared /app/shared/

# Copy package files and install dependencies
COPY dispatcher-service/package*.json ./
RUN npm install

# Copy source code
COPY dispatcher-service/ .

# Build shared modules first
RUN cd /app/shared && npm install && npm run clean && npm run build

# Build the application
RUN npm run clean && npm run build

# Expose the port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start"] 