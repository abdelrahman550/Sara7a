import bcrypt from "bcrypt";

export const hash = async (plaintext, rounds = 12) => {
  return await bcrypt.hash(plaintext, rounds);
};

export const compare = async (plaintext, hashedText) => {
  return await bcrypt.compare(plaintext, hashedText);
};
