import { Router } from "express";
import { successResponse } from "../../common/utils/index.js";
import { login, signup } from "./authentication.service.js";

const router = Router();

router.post("/signup", async (req, res, next) => {
  const data = await signup(req.body);
  return successResponse({
    res,
    message: "Signup Successful.",
    status: 201,
    data,
  });
});

router.post("/login", async (req, res, next) => {
  const data = await login(req.body);
  return successResponse({
    res,
    message: "Login Successful.",
    status: 200,
    data,
  });
});

export default router;
