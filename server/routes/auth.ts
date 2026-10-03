import { Router } from "express";
import Joi from "joi";

import { ACCESS_COOKIE, sessionCookieOptions, signAccessToken } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiters";
import { validate } from "../middleware/validate";
import { authenticate } from "../services/accounts";

export const authRouter = Router();

authRouter.post(
  "/login",
  authLimiter,
  validate(
    Joi.object({
      body: Joi.object({
        email: Joi.string().trim().lowercase().email().max(254).required(),
        password: Joi.string().min(1).max(128).required(),
      }).required(),
    })
  ),
  async (req, res, next) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const user = await authenticate(email, password);
      if (!user) {
        return res.status(401).json({ ok: false, message: "Incorrect email or password." });
      }

      res.cookie(ACCESS_COOKIE, signAccessToken(user.id, [user.role]), sessionCookieOptions());
      return res.status(200).json({ ok: true, user });
    } catch (err) {
      return next(err);
    }
  }
);

authRouter.post("/logout", (_req, res) => {
  const { maxAge: _maxAge, ...options } = sessionCookieOptions();
  res.clearCookie(ACCESS_COOKIE, options);
  res.status(200).json({ ok: true });
});
