import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { login, signup, signupWithGmail } from "./authentication.service.js";
import * as validators from "./authentication.validation.js";
import { BadRequestException } from "../../common/exceptions/error.exception.js";
import { validation } from "../../middleware/index.js";

const router = Router();

router.post(
  "/signup",
  validation(validators.signup),
  async (req, res, next) => {
    const data = await signup(req.validate);
    return successResponse({
      res,
      message: "Signup Successful.",
      status: 201,
      data,
    });
  },
);

router.post("/signup-with-gmail", async (req, res, next) => {
  const { data, status } = await signupWithGmail(
    req.body,
    `${req.protocol}://${req.host}`,
  );
  return successResponse({
    res,
    message: "Success.",
    status,
    data,
  });
});

router.post("/login", validation(validators.login), async (req, res, next) => {
  const data = await login(req.validate, `${req.protocol}://${req.host}`);
  return successResponse({
    res,
    message: "Login Successful.",
    status: 200,
    data,
  });
});

export default router;
