import { Router } from "express";
import { RoleEnum, TokenTypeEnum } from "../../common/enum/index.js";
import { authentication, authorization } from "../../middleware/index.js";
import { successResponse } from "./../../common/utils/index.js";
import {
  getProfile,
  logout,
  rotateToken,
  updateProfile,
} from "./users.service.js";

const router = Router();
router.get("/", authentication(), async (req, res, next) => {
  const data = await getProfile(req.user);
  return successResponse({
    res,
    message: "Success.",
    status: 200,
    data,
  });
});

router.patch(
  "/",
  authentication(),
  authorization(RoleEnum.USER),
  async (req, res, next) => {
    const data = await updateProfile(req.user, req.body);
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
