import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(`.env.${process.env.NODE_ENV ?? "dev"}`) });

export const PORT = parseInt(process.env.PORT ?? "5000");

export const DB_URI = process.env.DB_URI;