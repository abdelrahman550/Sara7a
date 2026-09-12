import mongoose from "mongoose";
import { DB_URI } from "../config.js";

export const bootstrapDB = async () => {
  await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 5000 });

  console.log("DB connected successfully");
};
