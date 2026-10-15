export const anonymousMessageResponse = async (message) => {
  return {
    _id: message._id,
    content: message.content,
    attachments: message.attachments,
    revealStatus: message.revealStatus,
    createdAt: message.createdAt,
  };
};

export const messageResponse = async (message) => {
  return {
    _id: message._id,
    content: message.content,
    attachments: message.attachments,
    createdAt: message.createdAt,
    senderId: message.senderId,
  };
};
