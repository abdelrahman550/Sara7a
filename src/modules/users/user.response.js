import { decryption } from "../../common/security/index.js";

export const userResponse = async (user) => {
  return {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    phone: user.phone ? await decryption(user.phone) : undefined,
    image: user.image,
    coverImage: user.coverImage,
    gender: user.gender,
    role: user.role,
    twoStepVerification: user.twoStepVerification ?? false,
  };
};
