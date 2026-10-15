import { z } from "zod";
import { revealRequestStatusEnum } from "../../common/enum/index.js";
import {
  getValidationMessage,
  VALIDATION_CODES,
} from "../../common/messages/index.js";
import { generalValidationFields } from "../../common/validation.js";

const paginationQuery = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(5),
};

export const createRevealRequest = (lang) => {
  return z.object({
    body: z.strictObject({
      messageId: generalValidationFields.mongoId(lang),
    }),
  });
};

export const gettingRevealRequests = (lang) => {
  return z.object({
    query: z.object({
      status: z
        .enum(Object.values(revealRequestStatusEnum), {
          error: () =>
            getValidationMessage(VALIDATION_CODES.REVEAL_STATUS_INVALID, lang),
        })
        .optional(),
      ...paginationQuery,
    }),
  });
};

export const gettingSentRevealRequests = (lang) => {
  return z.object({
    query: z.object({
      ...paginationQuery,
    }),
  });
};

export const decideRevealRequest = (lang) => {
  return z.object({
    params: z.object({
      requestId: generalValidationFields.mongoId(lang),
    }),
    body: z.strictObject({
      decision: z.enum(
        [revealRequestStatusEnum.APPROVED, revealRequestStatusEnum.REJECTED],
        {
          error: () =>
            getValidationMessage(
              VALIDATION_CODES.REVEAL_DECISION_INVALID,
              lang,
            ),
        },
      ),
    }),
  });
};