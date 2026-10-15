import {
  messagesFilterEnum,
  revealStatusEnum,
} from "../../common/enum/index.js";
import { NotFoundException } from "../../common/exceptions/index.js";
import {
  create,
  deleteOne,
  findById,
  findOne,
  paginate,
} from "../../common/repository/index.js";
import { MessageModel, UserModel } from "../../DB/models/index.js";
import { anonymousMessageResponse } from "./messages.response.js";

export const createMessage = async (
  { content, receiverId } = {},
  files = [],
  user = undefined,
) => {
  const receiverExistence = await findById({
    model: UserModel,
    id: receiverId,
  });

  if (!receiverExistence) {
    throw NotFoundException("Receiver not found.");
  }

  const message = await create({
    model: MessageModel,
    data: {
      receiverId,
      content,
      attachments: files?.map((ele) => ele.path),
      ...(user ? { senderId: user._id } : {}),
    },
  });

  return await anonymousMessageResponse(message);
};

export const getAllMessages = async ({ type, page, limit } = {}, user) => {
  const skip = (page - 1) * limit;
  let filter = {};
  if (type == messagesFilterEnum.RECEIVED) {
    filter = { receiverId: user._id };
  } else if (type == messagesFilterEnum.SENT) {
    filter = { senderId: user._id };
  } else {
    filter = {
      $or: [{ receiverId: user._id }, { senderId: user._id }],
    };
  }

  const {
    result,
    docsCount,
    pages,
    currentPage,
    limit: pageSize,
  } = await paginate({
    model: MessageModel,
    filter,
    page,
    size: limit,
    options: { sort: { createdAt: -1 } },
  });

  const messages = await Promise.all(
    result.map((message) => anonymousMessageResponse(message)),
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

export const deleteMessageById = async ({ messageId }, user) => {
  const data = await deleteOne({
    model: MessageModel,
    filter: {
      receiverId: user._id,
      _id: messageId,
    },
  });

  if (!data?.deletedCount) {
    throw NotFoundException("Message not found.");
  }
  return;
};

export const getMessageById = async ({ messageId }, user) => {
  const data = await findOne({
    model: MessageModel,
    filter: {
      _id: messageId,
      $or: [{ receiverId: user._id }, { senderId: user._id }],
    },
  });

  if (!data) {
    throw NotFoundException("Message not found.");
  }

  const response = await anonymousMessageResponse(data);

  if (
    data.senderId &&
    data.receiverId.equals(user._id) &&
    data.revealStatus === revealStatusEnum.APPROVED
  ) {
    const sender = await findById({
      model: UserModel,
      id: data.senderId,
      select: "firstName lastName image",
    });
    if (sender) {
      response.sender = {
        _id: sender._id,
        userName: sender.userName,
        image: sender.image,
      };
    }
  }

  return response;
};
