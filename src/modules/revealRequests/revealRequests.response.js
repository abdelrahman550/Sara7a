import { revealRequestStatusEnum } from "../../common/enum/index.js";

const userSummary = (user) => {
  if (!user?._id) return undefined;
  return { _id: user._id, userName: user.userName, image: user.image };
};

export const revealRequestResponse = async (request) => {
  return {
    _id: request._id,
    messageId: request.messageId,
    status: request.status,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
};

export const receivedRevealRequestResponse = async (request) => {
  const message = request.messageId?._id ? request.messageId : null;
  return {
    _id: request._id,
    status: request.status,
    requester: userSummary(request.receiverId),
    message: message
      ? {
          _id: message._id,
          content: message.content,
          attachments: message.attachments,
          createdAt: message.createdAt,
        }
      : null,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
};

export const sentRevealRequestResponse = async (request) => {
  return {
    _id: request._id,
    messageId: request.messageId,
    status: request.status,
    sender:
      request.status === revealRequestStatusEnum.APPROVED
        ? userSummary(request.senderId)
        : undefined,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
};