import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import geoip from "geoip-lite";
import { client } from "../../DB/connection.redis.js";
import { TooManyRequestsException } from "../exceptions/error.exception.js";

function fromWhere(ip) {
  try {
    return geoip.lookup(ip);
  } catch (error) {
    console.log(error);
  }
}

export const generateLimiter = ({
  ttl = 15,
  message = "Too many requests please try again later.",
  legacyHeaders = true,
  standardHeaders = "draft-8",
  skipSuccessfulRequests,
  skipFailedRequests,
  limitCount = 1000,
}) => {
  return rateLimit({
    windowMs: ttl * 60 * 1000,
    limit: function (req) {
      const data = fromWhere(req.ip);
      return data?.country == "EG" ? limitCount : 0;
    },
    legacyHeaders,
    standardHeaders,
    skipSuccessfulRequests,
    skipFailedRequests,
    handler: function (req, res, next) {
      throw TooManyRequestsException(message);
    },
    keyGenerator: function (req) {
      const ip = ipKeyGenerator(req.ip, 52);
      return `${ip}::${req.path}`;
    },
    store: {
      async incr(key, cb) {
        try {
          const count = await client.incr(key);

          if (count === 1) {
            await client.expire(key, ttl * 60);
          }

          cb(null, count);
        } catch (error) {
          cb(error);
        }
      },

      async decrement(key) {
        if (await client.exists(key)) {
          await client.decr(key);
        }
      },
    },
  });
};
