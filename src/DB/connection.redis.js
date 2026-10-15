import { createClient } from "redis";
import { REDIS_URI } from "../config.js";

export const client = createClient({
  url: REDIS_URI,
  pingInterval: 30_000,
  socket: {
    keepAlive: 30_000,
    reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
  },
});

client.on("error", (error) => {
  console.error("Redis error:", error.message);
});

client.on("reconnecting", () => console.log("Redis reconnecting..."));
client.on("ready", () => console.log("Redis ready"));

export const bootstrapRedis = async () => {
  if (client.isOpen) return;
  await client.connect();
  console.log("Redis connected successfully");
};
