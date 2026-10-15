import { Router } from "express";
import {
  fileTypeValidation,
  localFileUpload,
  successResponse,
} from "../../common/utils/index.js";
import {
  authentication,
  bearerAuth,
  multerUpload,
  validation,
} from "../../middleware/index.js";
import * as validators from "./message.validation.js";
import {
  createMessage,
  deleteMessageById,
  getAllMessages,
  getMessageById,
} from "./messages.service.js";

const router = Router({ caseSensitive: true });

const messagesFolderName = "messages";

router.post(
  "/",
  async (req, res, next) => {
    if (req.headers["authorization"]) {
      await bearerAuth({ req });
    }
    next();
  },
  multerUpload({
    multerMiddleware: localFileUpload().any("attachments", 3),
    validation: fileTypeValidation.images,
    customPath: messagesFolderName,
    isRequired: false,
  }),
  validation(validators.message),
  async (req, res, next) => {
    const data = await createMessage(req.body, req.files, req.user);
    successResponse({
      res,
      message: "message created successfully.",
      status: 201,
      data,
    });
  },
);

router.get(
  "/",
  authentication(),
  validation(validators.gettingMessages),
  async (req, res, next) => {
    const data = await getAllMessages(req.validate.query, req.user);
    successResponse({
      res,
      message: "Success.",
      status: 200,
      data,
    });
  },
);

router.get(
  "/:messageId",
  authentication(),
  validation(validators.messageById),
  async (req, res, next) => {
    const data = await getMessageById(req.validate.params, req.user);
    successResponse({
      res,
      message: "Success.",
      status: 200,
      data,
    });
  },
);

router.delete(
  "/:messageId",
  authentication(),
  validation(validators.messageById),
  async (req, res, next) => {
    await deleteMessageById(req.validate.params, req.user);
    successResponse({
      res,
      message: "Message deleted successfully.",
      status: 200,
    });
  },
);

export default router;
