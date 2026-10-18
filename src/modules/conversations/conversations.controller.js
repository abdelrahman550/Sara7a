import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { authentication, validation } from "../../middleware/index.js";
import {
  getConversationMessages,
  getConversations,
  sendConversationMessage
} from "./conversations.service.js";
import * as validators from "./conversations.validation.js";

const router = Router({ caseSensitive: true });

router.get(
  "/",
  authentication(),
  validation(validators.gettingConversations),
  async (req, res, next) => {
    const data = await getConversations(req.validate.query, req.user);
    return successResponse({
      res,
      message: "Success.",
      status: 200,
      data,
    });
  },
);

router.post(
  "/:conversationId/messages",
  authentication(),
  validation(validators.sendConversationMessage),
  async (req, res, next) => {
    const data = await sendConversationMessage(
      req.validate.params,
      req.validate.body,
      req.user,
    );
    return successResponse({
      res,
      message: "Message sent successfully.",
      status: 201,
      data,
    });
  },
);

router.get(
  "/:conversationId/messages",
  authentication(),
  validation(validators.gettingConversationMessages),
  async (req, res, next) => {
    const data = await getConversationMessages(
      req.validate.params,
      req.validate.query,
      req.user,
    );
    return successResponse({
      res,
      message: "Success.",
      status: 200,
      data,
    });
  },
);

export default router;
