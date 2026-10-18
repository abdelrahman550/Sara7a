import { NotFoundException } from "../../common/exceptions/index.js";
import { create, findOne, paginate } from "../../common/repository/index.js";
import {
  ConversationMessageModel,
  ConversationModel,
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
