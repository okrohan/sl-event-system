FROM node:18-alpine

WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript

# First, copy shared directory and its tsconfig
COPY shared /app/shared/

# Copy package files and install dependencies
COPY services/dispatcher-service/package*.json /app/
RUN npm install

# Copy source code
COPY services/dispatcher-service /app/

# Create a tsconfig.json that extends the shared one
RUN echo '{\
  "extends": "./shared/tsconfig.json",\
  "compilerOptions": {\
    "outDir": "./dist",\
    "baseUrl": ".",\
    "paths": {\
      "@shared/*": ["./shared/*"]\
    }\
  },\
  "references": [{\
    "path": "./shared"\
  }],\
  "include": ["./**/*"],\
  "exclude": ["node_modules", "dist", "shared"]\
}' > tsconfig.json

# Build shared modules first
RUN cd shared && npm install && npm run build

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"] 