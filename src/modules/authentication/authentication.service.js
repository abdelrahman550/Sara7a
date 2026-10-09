import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
} from "../../common/exceptions/index.js";
import { create, findOne } from "../../common/repository/index.js";
import {
  compare,
  createLoginCredentials,
  encryption,
  hash,
  userBaseRevokeTokenKey,
} from "../../common/security/index.js";
import { UserModel } from "./../../DB/models/index.js";

import { OAuth2Client } from "google-auth-library";
import { EmailSubjectEnum, ProviderEnum } from "../../common/enum/index.js";
import {
  createOtp,
  emailEvent,
  userEmailAttemptsKey,
  userEmailKey,
} from "../../common/utils/index.js";
import {
  LOGIN_BLOCK_TIME,
  LOGIN_MAX_ATTEMPTS,
  WEB_CLIENT_IDS,
} from "./../../config.js";
import {
  cacheDelete,
  cacheExpire,
  cacheGet,
  cacheIncrementBy,
  cacheKeys,
  cacheSet,
  cacheTTL,
  invalidateUserCache,
} from "../../common/services/index.js";
import { userResponse } from "../users/index.js";

const client = new OAuth2Client();

const userLoginAttemptsKey = ({ email }) => {
  return `User::${email}::LOGIN_ATTEMPT`;
};

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

const sendEmailOtp = async ({
  email,
  subject,
  expiresIn = 120,
  maxAttempts = 3,
  blockInSeconds = 300,
}) => {
  const existingOtpTTL = await cacheTTL({
    key: userEmailKey({ email, subject }),
  });

  if (existingOtpTTL > 0) {
    throw ConflictException(
      `Cannot send new OTP as there is still a valid one for ${existingOtpTTL}s`,
    );
  }

  const oldAttempts =
    (await cacheGet({ key: userEmailAttemptsKey({ email, subject }) })) ?? 0;

  if (oldAttempts >= maxAttempts) {
    throw TooManyRequestsException(
      "You have reached maximum OTP attempts please try again later.",
    );
  }
  const code = createOtp();
  await cacheSet({
    key: userEmailKey({ email, subject }),
    value: await hash(code),
    ttl: expiresIn,
  });

  const currentAttempts = await cacheIncrementBy({
    key: userEmailAttemptsKey({ email, subject }),
  });

  if (currentAttempts == maxAttempts) {
    await cacheExpire({
      key: userEmailAttemptsKey({ email, subject }),
      ttl: blockInSeconds,
    });
  }

  emailEvent.emit("sendEmail", {
    recipients: { to: email },
    subject,
    data: { code },
  });

  return;
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
  role,
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
      role,
    },
  });

  await sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });

  return await userResponse(account);
};

export const confirmEmail = async ({ otp, email }) => {
  const existingAccount = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });

  if (!existingAccount) {
    throw NotFoundException("Invalid Account.");
  }

  const hashOtp = await cacheGet({
    key: userEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
  });

  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw BadRequestException("Invalid or expired verification code.");
  }

  existingAccount.confirmEmail = new Date();
  await existingAccount.save();
  await invalidateUserCache({ userId: existingAccount._id });
  await cacheDelete({
    key: await cacheKeys({
      prefix: userEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
    }),
  });

  return;
};

export const resendEmailConfirmation = async ({ email }) => {
  const existingAccount = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });

  if (!existingAccount) {
    throw NotFoundException("Invalid Account.");
  }

  await sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });

  return;
};

export const sendForgottenPasswordCode = async ({ email }) => {
  const existingAccount = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!existingAccount) {
    throw NotFoundException("Invalid Account.");
  }

  await sendEmailOtp({ email, subject: EmailSubjectEnum.FORGET_PASSWORD });

  return;
};

export const verifyForgottenPasswordCode = async ({ otp, email }) => {
  const existingAccount = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!existingAccount) {
    throw NotFoundException("Invalid Account.");
  }

  const hashOtp = await cacheGet({
    key: userEmailKey({ email, subject: EmailSubjectEnum.FORGET_PASSWORD }),
  });

  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw BadRequestException("Invalid or expired verification code.");
  }

  return existingAccount;
};

export const resetForgottenPassword = async ({ otp, email, password }) => {
  const account = await verifyForgottenPasswordCode({ otp, email });

  account.password = await hash(password);
  account.changeCredentialsTime = new Date();
  await account.save();
  await invalidateUserCache({ userId: account._id });

  const keysResult = await Promise.all([
    cacheKeys({
      prefix: userBaseRevokeTokenKey({ userId: account._id.toString() }),
    }),
    cacheKeys({
      prefix: userEmailKey({
        email,
        subject: EmailSubjectEnum.FORGET_PASSWORD,
      }),
    }),
  ]);

  await cacheDelete({ key: [...keysResult[0], ...keysResult[1]] });

  return;
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

export const manageLogin = async ({ email, password }, issuer) => {
  const user = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
    },
  });

  const oldAttempts =
    (await cacheGet({ key: userLoginAttemptsKey({ email }) })) ?? 0;

  if (oldAttempts >= LOGIN_MAX_ATTEMPTS) {
    throw TooManyRequestsException(
      "You have reached maximum Login attempts please try again later.",
    );
  }

  if (user && !user?.confirmEmail)
    throw UnauthorizedException("Please confirm your email before logging in.");

  if (!user) throw UnauthorizedException("Invalid login credentials.");

  const approval = await compare(password, user.password);

  if (!approval) {
    const currentAttempts = await cacheIncrementBy({
      key: userLoginAttemptsKey({ email }),
    });
    if (currentAttempts == LOGIN_MAX_ATTEMPTS) {
      await cacheExpire({
        key: userLoginAttemptsKey({ email }),
        ttl: LOGIN_BLOCK_TIME,
      });
    }
    throw UnauthorizedException("Invalid login credentials.");
  }

  await cacheDelete({
    key: userLoginAttemptsKey({ email }),
  });

  if (user?.twoStepVerification) {
    await sendEmailOtp({ email, subject: EmailSubjectEnum.LOGIN_TWO_FACTOR });
    return;
  }

  return await createLoginCredentials({ user, issuer });
};

export const loginWith2FA = async ({ otp, email }, issuer) => {
  const user = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!user) {
    throw NotFoundException("Invalid Account.");
  }

  const hashOtp = await cacheGet({
    key: userEmailKey({ email, subject: EmailSubjectEnum.LOGIN_TWO_FACTOR }),
  });

  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw BadRequestException("Invalid or expired verification code.");
  }

  return await createLoginCredentials({ user, issuer });
};

export const send2StepVerificationCode = async ({ email }) => {
  const existingAccount = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!existingAccount) {
    throw NotFoundException("Invalid Account.");
  }

  await sendEmailOtp({ email, subject: EmailSubjectEnum.ENABLE_TWO_FACTOR });

  return;
};

export const enable2StepVerification = async ({ otp, email }) => {
  const existingAccount = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!existingAccount) {
    throw NotFoundException("Invalid Account.");
  }

  const hashOtp = await cacheGet({
    key: userEmailKey({ email, subject: EmailSubjectEnum.ENABLE_TWO_FACTOR }),
  });

  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw BadRequestException("Invalid or expired verification code.");
  }

  existingAccount.twoStepVerification = true;
  await existingAccount.save();
  await invalidateUserCache({ userId: existingAccount._id });

  return;
};
