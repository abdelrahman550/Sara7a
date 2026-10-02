import { z } from "zod";
import { GenderEnum, LanguageEnum } from "./enum/index.js";
import { VALIDATION_CODES, getValidationMessage } from "./messages/index.js";

const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/;

const requiredOrInvalid = (lang, requiredCode, invalidCode) => (issue) =>
  issue.input === undefined
    ? getValidationMessage(requiredCode, lang)
    : getValidationMessage(invalidCode, lang);

const matchFields = ({
  original,
  copy,
  data,
  ctx,
  lang = LanguageEnum.EN,
  code = VALIDATION_CODES.FIELDS_MISMATCH,
}) => {
  if (data[original] !== data[copy]) {
    ctx.addIssue({
      code: "custom",
      path: [copy],
      message: getValidationMessage(code, lang, { original, copy }),
    });
  }
};

export const generalValidationFields = {
  email: (lang) =>
    z.email({
      error: requiredOrInvalid(
        lang,
        VALIDATION_CODES.EMAIL_REQUIRED,
        VALIDATION_CODES.EMAIL_INVALID,
      ),
    }),

  password: (lang) =>
    z
      .string({
        error: requiredOrInvalid(
          lang,
          VALIDATION_CODES.PASSWORD_REQUIRED,
          VALIDATION_CODES.PASSWORD_INVALID,
        ),
      })
      .regex(
        PASSWORD_REGEX,
        getValidationMessage(VALIDATION_CODES.PASSWORD_WEAK, lang),
      ),

  passwordPresence: (lang) =>
    z
      .string({
        error: requiredOrInvalid(
          lang,
          VALIDATION_CODES.PASSWORD_REQUIRED,
          VALIDATION_CODES.PASSWORD_INVALID,
        ),
      })
      .min(1, getValidationMessage(VALIDATION_CODES.PASSWORD_REQUIRED, lang)),

  userName: (lang) =>
    z
      .string({
        error: requiredOrInvalid(
          lang,
          VALIDATION_CODES.USERNAME_REQUIRED,
          VALIDATION_CODES.USERNAME_INVALID,
        ),
      })
      .min(1, getValidationMessage(VALIDATION_CODES.USERNAME_REQUIRED, lang)),

  phone: (lang) =>
    z.e164({
      error: requiredOrInvalid(
        lang,
        VALIDATION_CODES.PHONE_REQUIRED,
        VALIDATION_CODES.PHONE_INVALID,
      ),
    }),

  gender: (lang) =>
    z.enum(GenderEnum, {
      error: requiredOrInvalid(
        lang,
        VALIDATION_CODES.GENDER_REQUIRED,
        VALIDATION_CODES.GENDER_INVALID,
      ),
    }),

  matchFields,
};
