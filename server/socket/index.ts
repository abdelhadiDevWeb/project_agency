import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { getRedis } from "../db/redis";

let io: Server | null = null;

export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: env.corsOrigins,
      credentials: true,
    },
  });

  // Scale Socket.IO across multiple instances via Redis pub/sub.
  // Callers must await connectRedis() before initSocket when Redis is enabled.
  const redis = getRedis();
  if (redis) {
    const pubClient = redis;
    const subClient = redis.duplicate();
    void subClient.connect().catch(() => {});
    io.adapter(createAdapter(pubClient, subClient));
  }

  io.use((socket, next) => {
    if (!env.socketRequireAuth) return next();
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || token.length < 1) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, env.jwt.accessSecret, {
        issuer: env.jwt.issuer,
        audience: env.jwt.audience,
      }) as jwt.JwtPayload;
      socket.data.user = {
        sub: decoded.sub,
        roles: Array.isArray(decoded.roles) ? decoded.roles : undefined,
      };
      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.emit("connected", { ok: true });
  });

  return io;
}

export async function closeSocket(): Promise<void> {
  if (!io) return;
  const current = io;
  io = null;
  await new Promise<void>((resolve) => {
    current.close(() => resolve());
  });
}
