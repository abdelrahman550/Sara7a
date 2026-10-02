import { createClient } from "redis";
import { REDIS_URI } from "../config.js";

export const client = createClient({
  url: REDIS_URI,
});

client.on("error", (error) => {
  console.error("Redis error:", error);
});

export const bootstrapRedis = async () => {
  await client.connect();

  console.log("Redis connected successfully");
};
