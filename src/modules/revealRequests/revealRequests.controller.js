import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { authentication, validation } from "../../middleware/index.js";
import {
  createRevealRequest,
  decideRevealRequest,
  getReceivedRevealRequests,
  getSentRevealRequests,
} from "./revealRequests.service.js";
import * as validators from "./revealRequests.validation.js";

const router = Router({ caseSensitive: true });

router.post(
  "/:messageId",
  authentication(),
  validation(validators.createRevealRequest),
  async (req, res, next) => {
    const data = await createRevealRequest(req.validate.params, req.user);
    return successResponse({
      res,
      message: "Reveal request created successfully.",
      status: 201,
      data,
    });
  },
);

router.get(
  "/received",
  authentication(),
  validation(validators.gettingRevealRequests),
  async (req, res, next) => {
    const data = await getReceivedRevealRequests(req.validate.query, req.user);
    return successResponse({
      res,
      message: "Success.",
      status: 200,
      data,
    });
  },
);

router.get(
  "/sent",
  authentication(),
  validation(validators.gettingSentRevealRequests),
  async (req, res, next) => {
    const data = await getSentRevealRequests(req.validate.query, req.user);
    return successResponse({
      res,
      message: "Success.",
      status: 200,
      data,
    });
  },
);

router.patch(
  "/:requestId/:decision",
  authentication(),
  validation(validators.decideRevealRequest),
  async (req, res, next) => {
    const data = await decideRevealRequest(
      req.validate.params,
      req.user,
    );
    return successResponse({
      res,
      message: "Reveal request decision saved successfully.",
      status: 200,
      data,
    });
  },
);

export default router;
