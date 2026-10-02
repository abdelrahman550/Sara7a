import { client } from "../../DB/connection.redis.js";

export const cacheSet = async ({ key, value, ttl = undefined } = {}) => {
  if (typeof value == "object") {
    value = JSON.stringify(value);
  }

  return await client.set(key, value, { EX: ttl });
};

export const cacheGet = async ({ key } = {}) => {
  let value = await client.get(key);
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const cacheExist = async ({ key } = {}) => {
  return await client.exists(key);
};

export const cacheUpdate = async ({ key, value, ttl = undefined } = {}) => {
  if (!(await cacheExist({ key }))) {
    return 0;
  }

  return await cacheSet({ key, value, ttl });
};

export const cacheDelete = async ({ key } = {}) => {
  return await client.del(key);
};

export const cacheKeys = async ({ prefix } = {}) => {
  return await client.keys(`${prefix}*`);
};

export const cacheTTL = async ({ key } = {}) => {
  return await client.ttl(key);
};

export const cacheExpire = async ({ key, ttl } = {}) => {
  return await client.expire(key, ttl);
};
