import { Router } from "express";
import { RoleEnum, TokenTypeEnum } from "../../common/enum/index.js";
import {
  authentication,
  authorization,
  multerUpload,
  validation,
} from "../../middleware/index.js";
import {
  fileTypeValidation,
  localFileUpload,
  successResponse,
} from "./../../common/utils/index.js";
import { userResponse } from "./index.js";
import { logout, rotateToken, updateProfile } from "./users.service.js";
import { invalidateUserCache } from "../../common/services/index.js";
import * as validators from "./users.validation.js";

const router = Router();
router.get("/", authentication(), async (req, res, next) => {
  const data = await userResponse(req.user);
  return successResponse({
    res,
    message: "Success.",
    status: 200,
    data,
  });
});

router.post(
  "/profile-image",
  authentication(),
  multerUpload({
    multerMiddleware: localFileUpload({ maxFileSize: 3 }).single("attachment"),
    customPath: "users",
    validation: fileTypeValidation.images,
  }),

  async (req, res, next) => {
    req.user.image = req.file.path;
    await req.user.save();
    await invalidateUserCache({ userId: req.user._id });

    return successResponse({
      res,
      message: "Success.",
      status: 200,
      data: { user: await userResponse(req.user) },
    });
  },
);

router.patch(
  "/",
  authentication(),
  authorization(RoleEnum.USER),
  validation(validators.updateProfile),
  async (req, res, next) => {
    const data = await updateProfile(req.user, req.validate.body);
    return successResponse({
      res,
      message: "Success.",
      status: 200,
      data,
    });
  },
);

router.post(
  "/rotate-token",
  authentication(TokenTypeEnum.REFRESH),
  async (req, res, next) => {
    const data = await rotateToken(
      req.payload,
      req.user,
      `${req.protocol}://${req.host}`,
    );
    return successResponse({
      res,
      message: "Success.",
      status: 200,
      data,
    });
  },
);

router.post("/logout", authentication(), async (req, res, next) => {
  await logout(req.payload, req.user, req.body);
  return successResponse({
    res,
    message: "Success.",
    status: 200,
  });
});

export default router;
