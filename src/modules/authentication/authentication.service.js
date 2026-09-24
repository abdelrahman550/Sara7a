import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from "../../common/exceptions/index.js";
import { create, findOne } from "../../common/repository/index.js";
import {
  compare,
  createLoginCredentials,
  encryption,
  hash,
} from "../../common/security/index.js";
import { UserModel } from "./../../DB/models/index.js";

import { OAuth2Client } from "google-auth-library";
import { ProviderEnum } from "../../common/enum/index.js";
import { WEB_CLIENT_IDS } from "./../../config.js";

const client = new OAuth2Client();

const verifyGoogleAccount = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: WEB_CLIENT_IDS,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified)
    throw BadRequestException("Google email not verified");
  return payload;
};

export const signup = async ({
  userName,
  email,
  password,
  phone,
  DOB,
  image,
  coverImage,
  gender,
}) => {
  const duplicatedUser = await findOne({
    model: UserModel,
    filter: { email },
    select: "email",
  });

  if (duplicatedUser)
    throw ConflictException("User with this email already exists.");

  const account = await create({
    model: UserModel,
    data: {
      userName,
      email,
      password: await hash(password),
      phone: await encryption(phone),
      DOB,
      image,
      coverImage,
      gender,
    },
  });

  return await account
};

export const signupWithGmail = async ({ idToken }, issuer) => {
  const { name, email, picture } = await verifyGoogleAccount(idToken);

  const existingAccount = await findOne({
    model: UserModel,
    filter: { email },
  });

  if (existingAccount) {
    if (existingAccount.provider != ProviderEnum.GOOGLE) {
      throw ConflictException("Invalid account provider");
    }
    return {
      status: 200,
      data: await createLoginCredentials({ user: existingAccount, issuer }),
    };
  }

  const user = await create({
    model: UserModel,
    data: {
      userName: name,
      email,
      confirmEmail: new Date(),
      image: picture,
      provider: ProviderEnum.GOOGLE,
    },
  });

  return {
    status: 201,
    data: await createLoginCredentials({ user, issuer }),
  };
};

export const login = async ({ email, password }, issuer) => {
  const user = await findOne({
    model: UserModel,
    filter: { email , provider : ProviderEnum.SYSTEM },
  });

  if (!user) throw UnauthorizedException("Invalid login credentials.");

  const approval = await compare(password, user.password);

  if (!approval) throw UnauthorizedException("Invalid login credentials.");

  return await createLoginCredentials({ user, issuer });
};
