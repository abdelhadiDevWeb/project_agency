import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { getRedis } from "../db/redis";

function redisStoreIfEnabled(): RedisStore | undefined {
  const redis = getRedis();
  if (!redis) return undefined;
  return new RedisStore({
    // `rate-limit-redis` expects a node-redis-like `sendCommand`.
    sendCommand: (...args: string[]) => (redis as any).call(...args),
  });
}

export const globalLimiter = rateLimit({
  limit: 120,
  windowMs: 60 * 1000,
  message: "Too many requests",
  legacyHeaders: false,
  standardHeaders: "draft-7",
  store: redisStoreIfEnabled(),
});

export const authLimiter = rateLimit({
  limit: 10,
  windowMs: 60 * 1000,
  message: "Too many auth attempts",
  legacyHeaders: false,
  standardHeaders: "draft-7",
  store: redisStoreIfEnabled(),
});

export const uploadLimiter = rateLimit({
  limit: 20,
  windowMs: 60 * 1000,
  message: "Too many uploads",
  legacyHeaders: false,
  standardHeaders: "draft-7",
  store: redisStoreIfEnabled(),
});

