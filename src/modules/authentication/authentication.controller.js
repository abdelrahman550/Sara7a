import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { validation } from "../../middleware/index.js";
import {
  confirmEmail,
  enable2StepVerification,
  loginWith2FA,
  manageLogin,
  resendEmailConfirmation,
  resetForgottenPassword,
  send2StepVerificationCode,
  sendForgottenPasswordCode,
  signup,
  signupWithGmail,
  verifyForgottenPasswordCode
} from "./authentication.service.js";
import * as validators from "./authentication.validation.js";

const router = Router();

router.post(
  "/signup",
  validation(validators.signup),
  async (req, res, next) => {
    const data = await signup(req.validate.body);
    return successResponse({
      res,
      message: "Signup Successful.",
      status: 201,
      data,
    });
  },
);

router.patch(
  "/confirm-email",
  validation(validators.emailAndCode),
  async (req, res, next) => {
    await confirmEmail(req.validate.body);
    return successResponse({
      res,
      message: "Email confirmation Successful.",
      status: 200,
    });
  },
);

router.post(
  "/verify-forgot-password",
  validation(validators.emailAndCode),
  async (req, res, next) => {
    await verifyForgottenPasswordCode(req.validate.body);
    return successResponse({
      res,
      message: "Forgotten password code verified Successfully.",
      status: 200,
    });
  },
);

router.patch(
  "/reset-forgot-password",
  validation(validators.resetForgottenPassword),
  async (req, res, next) => {
    await resetForgottenPassword(req.validate.body);
    return successResponse({
      res,
      message: "Password reset Successfully.",
      status: 200,
    });
  },
);

router.patch(
  "/resend-confirmation-email",
  validation(validators.emailConfirmation),
  async (req, res, next) => {
    await resendEmailConfirmation(req.validate.body);
    return successResponse({
      res,
      message: "Confirmation email sent Successfully.",
      status: 200,
    });
  },
);

router.post(
  "/forgot-password",
  validation(validators.emailConfirmation),
  async (req, res, next) => {
    await sendForgottenPasswordCode(req.validate.body);
    return successResponse({
      res,
      message: "Password reset code sent Successfully.",
      status: 200,
    });
  },
);

router.post(
  "/enable-2-step-verification",
  validation(validators.emailConfirmation),
  async (req, res, next) => {
    await send2StepVerificationCode(req.validate.body);
    return successResponse({
      res,
      message: "code to enable 2 step verification sent Successfully.",
      status: 200,
    });
  },
);

router.post(
  "/verify-2FA-enable-code",
  validation(validators.emailAndCode),
  async (req, res, next) => {
    await enable2StepVerification(req.validate.body);
    return successResponse({
      res,
      message: "2 step verification enabled Successfully.",
      status: 200,
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
  const data = await manageLogin(
    req.validate.body,
    `${req.protocol}://${req.host}`,
  );
  return successResponse({
    res,
    message: "Success.",
    status: 200,
    data,
  });
});

router.post("/verify-2FA-code", validation(validators.emailAndCode), async (req, res, next) => {
  const data = await loginWith2FA(
    req.validate.body,
    `${req.protocol}://${req.host}`,
  );
  return successResponse({
    res,
    message: "Success.",
    status: 200,
    data,
  });
});

export default router;
