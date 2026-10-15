import { LanguageEnum } from "../common/enum/index.js";
import { BadRequestException } from "../common/exceptions/index.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const lang = Number(req.headers["accept-language"] ?? LanguageEnum.EN);
    const validationResult = schema(lang).safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
      files: req.files,
    });

    if (!validationResult.success)
      throw BadRequestException(
        "Validation error.",
        validationResult.error.issues,
      );

    req.validate = validationResult.data;
    next();
  };
};
