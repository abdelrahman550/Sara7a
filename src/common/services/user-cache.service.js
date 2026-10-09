import { cacheDelete } from "./cache.service.js";

export const USER_CACHE_TTL = 10 * 60;

export const userCacheKey = ({ userId }) => {
  return `User::${userId.toString()}::DOC`;
};

export const invalidateUserCache = async ({ userId }) => {
  return await cacheDelete({ key: userCacheKey({ userId }) });
};