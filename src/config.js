import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(`.env.${process.env.NODE_ENV ?? "dev"}`) });

export const PORT = parseInt(process.env.PORT ?? "5000");
export const DB_URI = process.env.DB_URI;

export const ENC_KEY = process.env.ENC_KEY;
export const IV_LENGTH = parseInt(process.env.IV_LENGTH ?? 16);

export const ACCESS_TOKEN_SIGNATURE = process.env.ACCESS_TOKEN_SIGNATURE;
export const ADMIN_ACCESS_TOKEN_SIGNATURE =
  process.env.ADMIN_ACCESS_TOKEN_SIGNATURE;

export const ACCESS_TOKEN_EXPIRATION = parseInt(
  process.env.ACCESS_TOKEN_EXPIRATION ?? 1800,
);

export const REFRESH_TOKEN_SIGNATURE = process.env.REFRESH_TOKEN_SIGNATURE;
export const ADMIN_REFRESH_TOKEN_SIGNATURE =
  process.env.ADMIN_REFRESH_TOKEN_SIGNATURE;

export const REFRESH_TOKEN_EXPIRATION = parseInt(
  process.env.REFRESH_TOKEN_EXPIRATION ?? 86400,
);

export const WEB_CLIENT_IDS = process.env.WEB_CLIENT_IDS.split(",");
