import { z } from "zod";
import {
  getValidationMessage,
  VALIDATION_CODES,
} from "../../common/messages/index.js";
import { generalValidationFields } from "../../common/validation.js";

export const updateProfileSchema = (lang) => {
  return z
    .strictObject({
      firstName: generalValidationFields.firstName(lang).optional(),
      lastName: generalValidationFields.lastName(lang).optional(),
      phone: generalValidationFields.phone(lang).optional(),
      DOB: generalValidationFields.DOB(lang).optional(),
      gender: generalValidationFields.gender(lang).optional(),
    })
    .superRefine((data, ctx) => {
      if (Object.values(data).every((value) => value === undefined)) {
        ctx.addIssue({
          code: "custom",
          path: [],
          message: getValidationMessage(VALIDATION_CODES.UPDATE_EMPTY, lang),
        });
      }
    });
};

export const updateProfile = (lang) => {
  return z.object({
    body: updateProfileSchema(lang),
  });
};
