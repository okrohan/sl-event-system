import { KafkaClient, Producer, Consumer } from 'kafka-node';
import { Logger } from './logger';
import { IEvent } from './types/event';

export enum KafkaTopic {
  DEFAULT = 'default-events',
  CRITICAL = 'critical-events',
  RETRY = 'retry-events',
}

console.log('DEBUG:Kafka host:', process.env.KAFKA_BROKERS);
//Use environment variable for Kafka host

export class KafkaService {
  private static producer: Producer;
  private static consumer: Consumer;

  static initialize(kafkaHost = process.env.KAFKA_BROKERS || 'localhost:29092') {
    //Create Kafka client
    const client = new KafkaClient({
      kafkaHost: kafkaHost,
      connectTimeout: 10000,
      requestTimeout: 30000,
      autoConnect: true
    });

    this.producer = new Producer(client);
    this.consumer = new Consumer(client, [], {});

    //Setup producer error logging
    this.producer.on('error', (error: Error) => {
      Logger.error('Kafka producer error:', error);
    });

    //Setup consumer error logging
    this.consumer.on('error', (error: Error) => {
      Logger.error('Kafka consumer error:', error);
    });
  }

  //eslint-disable-next-line 
  static registerConsumer(controller: (event: IEvent) => Promise<void>, kafkaTopic: string) {
    this.consumer.addTopics([kafkaTopic], (err: Error | null, result: any) => {
      if (err) {
        Logger.error('Error subscribing to Kafka topic', err, event);
        return;
      }

      console.log('Successfully subscribed to Kafka topic', result, kafkaTopic);
      Logger.info('Successfully subscribed to Kafka topic', result);
    });

    this.consumer.on('message', async (message: any) => {
      try {
        const event: IEvent = JSON.parse(message.value.toString());
        Logger.info('Received event from Kafka', { eventId: event.id });

        await controller(event);
        Logger.info('Successfully processed event', { eventId: event.id });
      } catch (error) {
        Logger.error('Error processing Kafka message', error);
      }
    });
  }

  //Send event to Kafka
  static async sendEventToKafka(event: any, topic: string) {
    Logger.info('Sending event to Kafka:', event);
    const payloads = [
      {
        topic: topic,
        messages: JSON.stringify(event),
      },
    ];

    return new Promise<void>((resolve, reject) => {
      this.producer.send(payloads, (err: Error | null, data: any) => {
        if (err) {
          Logger.error('Failed to send event to Kafka:', err);
          reject(err);
        } else {
          console.log('Event sent to Kafka:' + topic, data);
          Logger.info('Event sent to Kafka:' + topic, data);
          resolve();
        }
      });
    });
  }
}
