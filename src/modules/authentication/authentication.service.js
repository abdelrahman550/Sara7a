import {
  ConflictException,
  UnauthorizedException,
} from "../../common/exceptions/index.js";
import { create, findOne } from "../../common/repository/index.js";
import { UserModel } from "./../../DB/models/index.js";

export const signup = async (inputs) => {
  const duplicatedUser = await findOne({
    model: UserModel,
    filter: { email: inputs.email },
    select: "email",
  });

  if (duplicatedUser)
    throw ConflictException("User with this email already exists.");

  const account = await create({
    model: UserModel,
    data: inputs,
  });
  return account;
};

export const login = async ({ email, password }) => {
  const user = await findOne({
    model: UserModel,
    filter: { email, password },
    select: "-password",
  });

  if (!user) throw UnauthorizedException("Invalid login credentials.");

  return user;
};
