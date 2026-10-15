import { z } from "zod";
import { generalValidationFields } from "../../common/validation.js";

const paginationQuery = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
};

export const createConversation = (lang) => {
  return z.object({
    body: z.strictObject({
      revealRequestId: generalValidationFields.mongoId(lang),
    }),
  });
};

export const gettingConversations = (lang) => {
  return z.object({
    query: z.object({ ...paginationQuery }),
  });
};

export const sendConversationMessage = (lang) => {
  return z.object({
    params: z.object({
      conversationId: generalValidationFields.mongoId(lang),
    }),
    body: z.strictObject({
      content: generalValidationFields.messageContent(lang),
    }),
  });
};

export const gettingConversationMessages = (lang) => {
  return z.object({
    params: z.object({
      conversationId: generalValidationFields.mongoId(lang),
    }),
    query: z.object({ ...paginationQuery }),
  });
};