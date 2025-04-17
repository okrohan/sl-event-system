import mongoose from 'mongoose';
import { Logger } from '../logger';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin@localhost:27017';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'EVENT_SYSTEM';

class MongoDBService {
  private static instance: MongoDBService;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await mongoose.connect(MONGODB_URI, {
        dbName: MONGODB_DB_NAME,
      });
      this.isConnected = true;
      Logger.info('Connected to MongoDB');
    } catch (error) {
      Logger.error('MongoDB connection error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      Logger.info('Disconnected from MongoDB');
    } catch (error) {
      Logger.error('MongoDB disconnection error:', error);
      throw error;
    }
  }

  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }
}

export const mongodbService = MongoDBService.getInstance();
