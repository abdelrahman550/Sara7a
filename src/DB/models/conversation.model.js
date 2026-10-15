import mongoose from "mongoose";

const MODEL_NAME = "Conversation";
const COLLECTION_NAME = "conversations";

const conversationSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    revealRequestId: {
      type: mongoose.Types.ObjectId,
      ref: "RevealRequest",
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
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

conversationSchema.index({ revealRequestId: 1 }, { unique: true });
conversationSchema.index({ senderId: 1, createdAt: -1 });
conversationSchema.index({ receiverId: 1, createdAt: -1 });

export const ConversationModel =
  mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, conversationSchema);