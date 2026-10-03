import express, { Router } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { env } from "../config/env";
import { getRedis } from "../db/redis";
import { ACCESS_COOKIE, requireAuth, sessionCookieOptions } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimiters";
import { findSessionUser } from "../services/accounts";
import { LOGO_DIR } from "../services/branding";
import { adminRouter } from "./admin";
import { agencyRouter } from "./agency";
import { authRouter } from "./auth";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/agency", agencyRouter);
apiRouter.use(
  "/uploads/logos",
  express.static(LOGO_DIR, { index: false, dotfiles: "deny", redirect: false, maxAge: "30d", immutable: true })
);

apiRouter.get("/health", async (_req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;

  let redis: "disabled" | "up" | "down" = "disabled";
  if (env.redis.enabled) {
    const client = getRedis();
    try {
      if (!client) {
        redis = "down";
      } else {
        const pong = await client.ping();
        redis = pong === "PONG" ? "up" : "down";
      }
    } catch {
      redis = "down";
    }
  }

  const ok = mongoReady && redis !== "down";
  res.status(ok ? 200 : 503).json({
    ok,
    checks: {
      mongo: mongoReady ? "up" : "down",
      redis,
    },
  });
});

// Demo-only token mint. Disabled in production (env.allowDemoAuth is always false there).
apiRouter.post(
  "/auth/token",
  authLimiter,
  validate(
    Joi.object({
      body: Joi.object({
        userId: Joi.string().min(1).required(),
        roles: Joi.array().items(Joi.string()).default([]),
      }).required(),
    })
  ),
  (req, res) => {
    if (!env.allowDemoAuth) {
      return res.status(403).json({
        ok: false,
        message: "Demo auth is disabled. Implement real login before issuing tokens.",
      });
    }

    const { userId, roles } = req.body as { userId: string; roles: string[] };

    const token = jwt.sign({ roles }, env.jwt.accessSecret, {
      subject: userId,
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
      expiresIn: "15m",
    });

    res.status(200).json({ ok: true, accessToken: token });
  }
);

apiRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await findSessionUser(req.user!);
    if (!user) {
      const { maxAge: _maxAge, ...options } = sessionCookieOptions();
      res.clearCookie(ACCESS_COOKIE, options);
      return res.status(401).json({ ok: false, message: "Session expired" });
    }
    return res.status(200).json({ ok: true, user });
  } catch (err) {
    return next(err);
  }
});
