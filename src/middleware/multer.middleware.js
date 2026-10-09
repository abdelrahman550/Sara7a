import { AppError, BadRequestException } from "../common/exceptions/index.js";
import { processMulterUpload } from "../common/utils/index.js";

export const multerUpload = ({
  isRequired = true,
  multerMiddleware,
  customPath = "general",
  validation = [],
}) => {
  return (req, res, next) => {
    multerMiddleware(req, res, async (error) => {
      if (error) {
        next(new AppError(error.message, 400));
        return;
      }
      try {
        if (
          isRequired &&
          !req.file &&
          !(Array.isArray(req.files) && req.files.length) &&
          !(typeof req.files == "object" && Object.keys(req.files)?.length)
        ) {
          next(BadRequestException("Attachment is required."));
          return;
        }
        await processMulterUpload({ req, customPath, validation });
        next();
      } catch (error) {
        next(new AppError(error.message, 400));
      }
    });
  };
};