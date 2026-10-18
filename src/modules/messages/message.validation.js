import { z } from "zod";
import { generalValidationFields } from "../../common/validation.js";
import {
  getValidationMessage,
  VALIDATION_CODES,
} from "../../common/messages/validation.messages.js";
import { messagesFilterEnum } from "../../common/enum/index.js";

export const messageSchema = (lang) => {
  return z.object({
    receiverId: generalValidationFields.mongoId(lang),
    content: generalValidationFields.messageContent(lang).optional(),
  });
};

export const message = (lang) => {
  return z
    .object({
      body: messageSchema(lang),
      files: generalValidationFields.messageFiles(lang).optional().default([]),
    })
    .superRefine((data, ctx) => {
      if (!data.body.content && !data.files?.length) {
        ctx.addIssue({
          code: "custom",
          path: ["body", "content"],
          message: getValidationMessage(VALIDATION_CODES.MESSAGE_EMPTY, lang),
        });
      }
    });
};

export const gettingMessages = (lang) => {
  const typeError = () =>
    getValidationMessage(VALIDATION_CODES.MESSAGE_TYPE_INVALID, lang);

  return z.object({
    query: z.object({
      type: z
        .enum(messagesFilterEnum, { error: typeError })
        .default(messagesFilterEnum.RECEIVED),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(5),
    }),
  });
};

export const messageByIdSchema = (lang) => {
  return z.object({
    messageId: generalValidationFields.mongoId(lang),
  });
};

export const messageById = (lang) => {
  return z.object({
    params: messageByIdSchema(lang),
  });
};
