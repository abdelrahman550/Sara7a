import mongoose from "mongoose";

const MODEL_NAME = "ConversationMessage";
const COLLECTION_NAME = "conversation_messages";

const conversationMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      minLength: 2,
      maxLength: 50000,
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

conversationMessageSchema.index({ conversationId: 1, createdAt: -1 });

export const ConversationMessageModel =
  mongoose.models[MODEL_NAME] ||
  mongoose.model(MODEL_NAME, conversationMessageSchema);
