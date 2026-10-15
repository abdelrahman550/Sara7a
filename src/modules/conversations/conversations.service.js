import { revealRequestStatusEnum } from "../../common/enum/index.js";
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "../../common/exceptions/index.js";
import {
  create,
  findById,
  findOne,
  paginate,
} from "../../common/repository/index.js";
import {
  ConversationMessageModel,
  ConversationModel,
  RevealRequestModel,
} from "../../DB/models/index.js";
import {
  conversationMessageResponse,
  conversationResponse,
} from "./conversations.response.js";

const participantsPopulate = [
  { path: "senderId", select: "firstName lastName image" },
  { path: "receiverId", select: "firstName lastName image" },
];

const participantFilter = (user) => ({
  $or: [{ senderId: user._id }, { receiverId: user._id }],
});

const findParticipantConversation = async ({ conversationId, user }) => {
  const conversation = await findOne({
    model: ConversationModel,
    filter: { _id: conversationId, ...participantFilter(user) },
  });

  if (!conversation) {
    throw NotFoundException("Conversation not found.");
  }

  return conversation;
};

export const createConversation = async ({ revealRequestId }, user) => {
  const request = await findOne({
    model: RevealRequestModel,
    filter: { _id: revealRequestId, ...participantFilter(user) },
  });

  if (!request) {
    throw NotFoundException("Reveal request not found.");
  }

  if (request.status !== revealRequestStatusEnum.APPROVED) {
    throw ForbiddenException(
      "The identity request must be approved before starting a conversation.",
    );
  }

  const duplicateError = async () => {
    const existing = await findOne({
      model: ConversationModel,
      filter: { revealRequestId: request._id },
      select: "_id",
    });
    return ConflictException(
      "A conversation already exists for this request.",
      { conversationId: existing?._id },
    );
  };

  if (
    await findOne({
      model: ConversationModel,
      filter: { revealRequestId: request._id },
      select: "_id",
    })
  ) {
    throw await duplicateError();
  }

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
    if (error?.code === 11000) {
      throw await duplicateError();
    }
    throw error;
  }

  const populated = await findById({
    model: ConversationModel,
    id: conversation._id,
    options: { populate: participantsPopulate },
  });

  return await conversationResponse(populated);
};

export const getConversations = async ({ page, limit } = {}, user) => {
  const {
    result,
    docsCount,
    pages,
    currentPage,
    limit: pageSize,
  } = await paginate({
    model: ConversationModel,
    filter: participantFilter(user),
    page,
    size: limit,
    options: { sort: { createdAt: -1 }, populate: participantsPopulate },
  });

  const conversations = await Promise.all(
    result.map((conversation) => conversationResponse(conversation)),
  );

  return {
    pagination: {
      total: docsCount,
      pages,
      currentPage,
      limit: pageSize,
    },
    conversations,
  };
};

export const sendConversationMessage = async (
  { conversationId },
  { content },
  user,
) => {
  const conversation = await findParticipantConversation({
    conversationId,
    user,
  });

  const message = await create({
    model: ConversationMessageModel,
    data: {
      conversationId: conversation._id,
      senderId: user._id,
      content,
    },
  });

  return await conversationMessageResponse(message);
};

export const getConversationMessages = async (
  { conversationId },
  { page, limit } = {},
  user,
) => {
  const conversation = await findParticipantConversation({
    conversationId,
    user,
  });

  const {
    result,
    docsCount,
    pages,
    currentPage,
    limit: pageSize,
  } = await paginate({
    model: ConversationMessageModel,
    filter: { conversationId: conversation._id },
    page,
    size: limit,
    options: { sort: { createdAt: -1, _id: -1 } },
  });

  const messages = await Promise.all(
    result.reverse().map((message) => conversationMessageResponse(message)),
  );

  return {
    pagination: {
      total: docsCount,
      pages,
      currentPage,
      limit: pageSize,
    },
    messages,
  };
};