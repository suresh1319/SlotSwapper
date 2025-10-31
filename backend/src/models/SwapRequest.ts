import mongoose, { Document, Schema } from 'mongoose';

export enum SwapStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface ISwapRequest extends Document {
  requesterUserId: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  requesterSlotId: mongoose.Types.ObjectId;
  targetSlotId: mongoose.Types.ObjectId;
  status: SwapStatus;
  createdAt: Date;
  respondedAt?: Date;
}

const SwapRequestSchema: Schema = new Schema({
  requesterUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requesterSlotId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  targetSlotId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: Object.values(SwapStatus),
    default: SwapStatus.PENDING
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  }
});

export default mongoose.model<ISwapRequest>('SwapRequest', SwapRequestSchema);