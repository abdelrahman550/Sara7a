import mongoose from "mongoose";
import { revealRequestStatusEnum } from "../../common/enum/index.js";

const MODEL_NAME = "RevealRequest";
const COLLECTION_NAME = "reveal_requests";

const revealRequestSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(revealRequestStatusEnum),
      default: revealRequestStatusEnum.PENDING,
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
  },
);

revealRequestSchema.index(
  { messageId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: revealRequestStatusEnum.PENDING },
  },
);
revealRequestSchema.index({ senderId: 1, createdAt: -1 });
revealRequestSchema.index({ receiverId: 1, createdAt: -1 });

export const RevealRequestModel =
  mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, revealRequestSchema);
