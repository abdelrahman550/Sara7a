const participantSummary = (user) => {
  if (!user?._id) return undefined;
  return { _id: user._id, userName: user.userName, image: user.image };
};

export const conversationResponse = async (conversation) => {
  return {
    _id: conversation._id,
    messageId: conversation.messageId,
    revealRequestId: conversation.revealRequestId,
    sender: participantSummary(conversation.senderId),
    receiver: participantSummary(conversation.receiverId),
    createdAt: conversation.createdAt,
  };
};

export const conversationMessageResponse = async (message) => {
  return {
    _id: message._id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt,
  };
};