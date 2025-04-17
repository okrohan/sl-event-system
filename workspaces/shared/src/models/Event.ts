import mongoose, { Document, Schema } from 'mongoose';

export enum IEventStatus {
  SCHEDULED = 'SCHEDULED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
  DEAD_LETTERED = 'DEAD_LETTERED',
}

export interface IEventDocument extends Document {
  id: string;
  eventId: string;
  retryCount: number;
  channel: string;
  priority: string;
  provider: string;
  payload: any;
  status: IEventStatus;
  createdAt: Date;
  updatedAt: Date;
  failureLogs: any[];
}

const EventSchema = new Schema<IEventDocument>(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true },
    retryCount: { type: Number, default: 0 },
    channel: { type: String, required: true },
    provider: { type: String, required: true },
    priority: { type: String, required: true },
    failureLogs: { type: Schema.Types.Mixed, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: Object.values(IEventStatus),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const EventModel = mongoose.model<IEventDocument>('Event', EventSchema);
