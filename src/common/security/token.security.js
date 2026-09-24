import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_SIGNATURE,
  ADMIN_ACCESS_TOKEN_SIGNATURE,
  ADMIN_REFRESH_TOKEN_SIGNATURE,
  REFRESH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SIGNATURE,
} from "../../config.js";
import { UserModel } from "../../DB/models/index.js";
import {
  NotFoundException,
  UnauthorizedException,
} from "../exceptions/index.js";
import { findById, findOne } from "../repository/index.js";
import { RoleEnum, TokenTypeEnum } from "../enum/index.js";
import { compare } from "./index.js";

export const createToken = async ({
  payload = {},
  options = {},
  secret = ACCESS_TOKEN_SIGNATURE,
} = {}) => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = async ({
  token = "",
  secret = ACCESS_TOKEN_SIGNATURE,
} = {}) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw UnauthorizedException("Invalid or expired token.");
  }
};

const getTokenSignatures = async ({ role = RoleEnum.USER } = {}) => {
  let signatures;

  switch (role) {
    case RoleEnum.ADMIN:
      signatures = {
        accessSignature: ADMIN_ACCESS_TOKEN_SIGNATURE,
        refreshSignature: ADMIN_REFRESH_TOKEN_SIGNATURE,
      };
      break;

    default:
      signatures = {
        accessSignature: ACCESS_TOKEN_SIGNATURE,
        refreshSignature: REFRESH_TOKEN_SIGNATURE,
      };

      break;
  }
  return signatures;
};

const getSignature = async ({
  tokenType = TokenTypeEnum.ACCESS,
  role = RoleEnum.USER,
} = {}) => {
  const signatures = await getTokenSignatures({ role });
  return tokenType == TokenTypeEnum.ACCESS
    ? signatures.accessSignature
    : signatures.refreshSignature;
};

export const decodeToken = async ({
  authorization = "",
  tokenType = TokenTypeEnum.ACCESS,
} = {}) => {
  const decoded = jwt.decode(authorization);

  if (!decoded?.aud?.length) {
    throw UnauthorizedException("Invalid token payload.");
  }

  const payload = await verifyToken({
    token: authorization,
    secret: await getSignature({ tokenType, role: decoded.aud[0] }),
  });
  if (!payload.sub) {
    throw UnauthorizedException("Invalid token payload.");
  }

  const user = await findById({
    model: UserModel,
    id: payload.sub,
  });

  if (!user) {
    throw NotFoundException("User not found.");
  }

  return { user, payload };
};

export const createLoginCredentials = async ({
  user,
  issuer,
  options = {},
}) => {
  const { accessSignature, refreshSignature } = await getTokenSignatures({
    role: user.role,
  });
  const access_token = await createToken({
    payload: { sub: user._id },
    secret: accessSignature,
    options: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    },
  });

  const refresh_token = await createToken({
    payload: { sub: user._id },
    secret: refreshSignature,
    options: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    },
  });

  return { access_token, refresh_token };
};

export const basicAuth = async ({ email, password }) => {
  const user = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (!user) throw UnauthorizedException("Invalid login credentials.");

  const approval = await compare(password, user.password);

  if (!approval) throw UnauthorizedException("Invalid login credentials.");

  return user;
};
