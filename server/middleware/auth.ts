import type { CookieOptions, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const ACCESS_COOKIE = "access_token";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
    maxAge: SESSION_TTL_SECONDS * 1000,
  };
}

export function signAccessToken(subject: string, roles: string[]): string {
  return jwt.sign({ roles }, env.jwt.accessSecret, {
    subject,
    issuer: env.jwt.issuer,
    audience: env.jwt.audience,
    expiresIn: SESSION_TTL_SECONDS,
  });
}

export type JwtUser = {
  sub: string;
  roles?: string[];
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}

function getBearerToken(authHeader: unknown): string | null {
  if (typeof authHeader !== "string") return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return null;
  if (!token) return null;
  return token;
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const cookieToken: unknown = req.cookies?.[ACCESS_COOKIE];
  const token =
    getBearerToken(req.headers.authorization) ?? (typeof cookieToken === "string" && cookieToken ? cookieToken : null);
  if (!token) return res.status(401).json({ ok: false, message: "Missing token" });

  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret, {
      issuer: env.jwt.issuer,
      audience: env.jwt.audience,
    }) as jwt.JwtPayload;

    if (!decoded.sub) return res.status(401).json({ ok: false, message: "Invalid token" });
    req.user = { sub: decoded.sub, roles: Array.isArray(decoded.roles) ? (decoded.roles as string[]) : undefined };
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
};

export function requireRole(...allowed: string[]): RequestHandler {
  return (req, res, next) => {
    const roles = req.user?.roles ?? [];
    if (!roles.some((role) => allowed.includes(role))) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }
    return next();
  };
}

