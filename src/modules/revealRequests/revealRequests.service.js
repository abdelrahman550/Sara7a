import {
  revealRequestStatusEnum,
  revealStatusEnum,
} from "../../common/enum/index.js";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "../../common/exceptions/index.js";
import {
  create,
  findOne,
  findOneAndUpdate,
  paginate,
  updateOne,
} from "../../common/repository/index.js";
import {
  ConversationModel,
  MessageModel,
  RevealRequestModel,
} from "../../DB/models/index.js";
import {
  receivedRevealRequestResponse,
  revealRequestResponse,
  sentRevealRequestResponse,
} from "./revealRequests.response.js";

const userSummarySelect = "firstName lastName image";

export const createRevealRequest = async ({ messageId }, user) => {
  const message = await findOne({
    model: MessageModel,
    filter: { _id: messageId, receiverId: user._id },
  });

  if (!message) {
    throw NotFoundException("Message not found.");
  }

  if (!message.senderId) {
    throw BadRequestException(
      "The sender of this message cannot be asked to reveal their identity.",
    );
  }

  if (message.senderId.equals(user._id)) {
    throw BadRequestException("You cannot request your own identity.");
  }

  const existing = await findOne({
    model: RevealRequestModel,
    filter: { messageId: message._id },
  });

  if (existing) {
    throw ConflictException(
      existing.status === revealRequestStatusEnum.PENDING
        ? "A reveal request for this message is already pending."
        : `A reveal request for this message was already ${existing.status}.`,
    );
  }

  let request;
  try {
    request = await create({
      model: RevealRequestModel,
      data: {
        messageId: message._id,
        receiverId: user._id,
        senderId: message.senderId,
      },
    });
  } catch (error) {
    if (error?.code === 11000) {
      throw ConflictException(
        "A reveal request for this message is already pending.",
      );
    }
    throw error;
  }

  await updateOne({
    model: MessageModel,
    filter: { _id: message._id },
    update: { $set: { revealStatus: revealStatusEnum.PENDING } },
  });

  return await revealRequestResponse(request);
};

export const getReceivedRevealRequests = async (
  { status, page, limit } = {},
  user,
) => {
  const {
    result,
    docsCount,
    pages,
    currentPage,
    limit: pageSize,
  } = await paginate({
    model: RevealRequestModel,
    filter: { senderId: user._id, ...(status ? { status } : {}) },
    page,
    size: limit,
    options: {
      sort: { createdAt: -1 },
      populate: [
        { path: "receiverId", select: userSummarySelect },
        { path: "messageId", select: "content attachments createdAt" },
      ],
    },
  });

  const requests = await Promise.all(
    result.map((request) => receivedRevealRequestResponse(request)),
  );

  return {
    pagination: {
      total: docsCount,
      pages,
      currentPage,
      limit: pageSize,
    },
    requests,
  };
};

export const getSentRevealRequests = async ({ page, limit } = {}, user) => {
  const {
    result,
    docsCount,
    pages,
    currentPage,
    limit: pageSize,
  } = await paginate({
    model: RevealRequestModel,
    filter: { receiverId: user._id },
    page,
    size: limit,
    options: {
      sort: { createdAt: -1 },
      populate: [{ path: "senderId", select: userSummarySelect }],
    },
  });

  const requests = await Promise.all(
    result.map((request) => sentRevealRequestResponse(request)),
  );

  return {
    pagination: {
      total: docsCount,
      pages,
      currentPage,
      limit: pageSize,
    },
    requests,
  };
};

export const decideRevealRequest = async ({ requestId, decision }, user) => {
  const request = await findOne({
    model: RevealRequestModel,
    filter: { _id: requestId, senderId: user._id },
  });

  if (!request) {
    throw NotFoundException("Reveal request not found.");
  }

  if (request.status !== revealRequestStatusEnum.PENDING) {
    throw ConflictException(`This request was already ${request.status}.`);
  }

  const updated = await findOneAndUpdate({
    model: RevealRequestModel,
    filter: {
      _id: requestId,
      senderId: user._id,
      status: revealRequestStatusEnum.PENDING,
    },
    update: { $set: { status: decision } },
  });

  if (!updated) {
    throw ConflictException("This request has already been decided.");
  }

  const approved = decision === revealRequestStatusEnum.APPROVED;

  await updateOne({
    model: MessageModel,
    filter: { _id: request.messageId },
    update: {
      $set: {
        revealStatus: approved
          ? revealStatusEnum.APPROVED
          : revealStatusEnum.REJECTED,
        revealedSender: approved,
      },
    },
  });

  const response = await revealRequestResponse(updated);

  if (!approved) return response;

  let conversation;
  try {
    conversation = await create({
      model: ConversationModel,
      data: {
        messageId: request.messageId,
        revealRequestId: request._id,
        senderId: request.senderId,
        receiverId: request.receiverId,
      },
    });
  } catch (error) {
    if (error?.code !== 11000) throw error;
    conversation = await findOne({
      model: ConversationModel,
      filter: { revealRequestId: request._id },
    });
  }

  return { ...response, conversationId: conversation?._id };
};
