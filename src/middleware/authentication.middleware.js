import { TokenTypeEnum } from "../common/enum/index.js";
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from "../common/exceptions/index.js";
import { basicAuth, decodeToken } from "../common/security/index.js";

export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) throw UnauthorizedException("Unauthorized account.");

    const [key, credential] = authorization.split(" ") || [];

    switch (key) {
      case "Basic":
        const [email, password] = Buffer.from(credential, "base64")
          .toString()
          ?.split(":");

        req.user = await basicAuth({ email, password });
        break;
      case "Bearer":
        const { user, payload } = await decodeToken({
          authorization: credential,
          tokenType,
        });
        req.user = user;
        req.payload = payload;
        break;

      default:
        next(BadRequestException("Invalid authentication schema"));
        break;
    }
    next();
  };
};

export const authorization = (accessRole) => {
  return async (req, res, next) => {
    if (req.user.role < accessRole) {
      throw ForbiddenException("Forbidden account");
    }

    next();
  };
};
