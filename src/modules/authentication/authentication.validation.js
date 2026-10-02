import { z } from "zod";
import {
  VALIDATION_CODES,
  getValidationMessage,
} from "../../common/messages/index.js";
import { generalValidationFields } from "../../common/validation.js";

export const loginSchema = (lang) => {
  return z.strictObject({
    email: generalValidationFields.email(lang),
    password: generalValidationFields.passwordPresence(lang),
  });
};

export const login = (lang) => {
  return z.object({
    body: loginSchema(lang),
  });
};

export const signupSchema = (lang) => {
  return loginSchema(lang)
    .safeExtend({
      userName: generalValidationFields.userName(lang),
      phone: generalValidationFields.phone(lang),
      password: generalValidationFields.password(lang),
      confirmPassword: generalValidationFields.passwordPresence(lang),
      gender: generalValidationFields.gender(lang),
    })
    .superRefine((data, ctx) => {
      generalValidationFields.matchFields({
        original: "password",
        copy: "confirmPassword",
        data,
        ctx,
        lang,
        code: VALIDATION_CODES.PASSWORD_MISMATCH,
      });

      if (
        typeof data.userName === "string" &&
        !data.userName.trim().includes(" ")
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["userName"],
          message: getValidationMessage(
            VALIDATION_CODES.USERNAME_FULL_NAME,
            lang,
          ),
        });
      }
    });
};

export const signup = (lang) => {
  return z.object({
    body: signupSchema(lang),
  });
};
