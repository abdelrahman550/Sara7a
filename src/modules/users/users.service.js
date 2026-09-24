import { ConflictException } from "../../common/exceptions/error.exception.js";
import { findByIdAndUpdate } from "../../common/repository/index.js";
import {
  createLoginCredentials,
  encryption,
} from "../../common/security/index.js";
import { ACCESS_TOKEN_EXPIRATION } from "../../config.js";
import { UserModel } from "../../DB/models/user.model.js";

export const getProfile = async (user) => {
  return user
};

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

  return updateUser;
};

export const rotateToken = async (payload, user, issuer) => {
  const accessExpiration = (payload.iat + ACCESS_TOKEN_EXPIRATION) * 1000;
  const maxTimeAllowed = Date.now() + 5 * 60000;
  if (maxTimeAllowed < accessExpiration) {
    throw ConflictException(
      "Cannot create new credentials as the current one is still within time range.",
    );
  }
  return await createLoginCredentials({ user, issuer });
};
