import { LogoutEnum } from "../../common/enum/security.enum.js";
import { ConflictException } from "../../common/exceptions/error.exception.js";
import { findByIdAndUpdate } from "../../common/repository/index.js";
import {
  createLoginCredentials,
  createRevokeToken,
  encryption,
  userBaseRevokeTokenKey,
} from "../../common/security/index.js";
import { cacheDelete, cacheKeys } from "../../common/services/cache.service.js";
import { invalidateUserCache } from "../../common/services/index.js";
import { ACCESS_TOKEN_EXPIRATION } from "../../config.js";
import { UserModel } from "../../DB/models/user.model.js";
import { userResponse } from "./index.js";

export const updateProfile = async (
  user,
  { firstName, lastName, phone, DOB, gender, image, coverImage },
) => {
  const update = { firstName, lastName, DOB, gender, image, coverImage };

  if (phone !== undefined) update.phone = await encryption(phone);

  const updateUser = await findByIdAndUpdate({
    model: UserModel,
    id: user._id,
    update,
  });
  await invalidateUserCache({ userId: user._id });

  return userResponse(updateUser);
};

export const rotateToken = async (payload, user, issuer) => {
  const accessExpiration = (payload.iat + ACCESS_TOKEN_EXPIRATION) * 1000;
  const maxTimeAllowed = Date.now() + 5 * 60000;
  if (maxTimeAllowed < accessExpiration) {
    throw ConflictException(
      "Cannot create new credentials as the current one is still within time range.",
    );
  }
  const data = await createLoginCredentials({ user, issuer });
  await createRevokeToken({ payload });
  return data;
};

export const logout = async (payload, user, { action = LogoutEnum.ONE }) => {
  switch (action) {
    case LogoutEnum.ALL:
      user.changeCredentialsTime = new Date();
      await user.save();
      await invalidateUserCache({ userId: user._id });

      await cacheDelete({
        key: await cacheKeys({
          prefix: userBaseRevokeTokenKey({ userId: payload.sub }),
        }),
      });
      break;

    default:
      await createRevokeToken({ payload });
      break;
  }
  return;
};
