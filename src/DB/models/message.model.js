import mongoose from "mongoose";
import { revealStatusEnum } from "../../common/enum/index.js";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 50000,
      required: function () {
        return this.attachments?.length > 0 ? false : true;
      },
    },

    attachments: [String],
    revealedSender: {
      type: Boolean,
      default: false,
    },
    revealStatus: {
      type: String,
      enum: Object.values(revealStatusEnum),
      default: revealStatusEnum.NONE,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
  },
);

export const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
