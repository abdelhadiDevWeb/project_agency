import http from "node:http";

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";

import { env } from "./config/env";
import { connectMongo, disconnectMongo } from "./db/mongoose";
import { connectRedis, disconnectRedis } from "./db/redis";
import { ensureDefaultAdmin } from "./db/seed";
import { csrfErrorHandler, csrfProtection } from "./middleware/csrf";
import { httpLogger } from "./middleware/logger";
import { globalLimiter } from "./middleware/rateLimiters";
import { apiRouter } from "./routes";
import { closeSocket, initSocket } from "./socket";

const app = express();
app.set("trust proxy", env.trustProxy);
app.disable("x-powered-by");

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // allow same-origin / server-to-server / curl
    if (!origin) return callback(null, true);
    if (env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(compression());
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));
app.use(cookieParser(env.cookieSecret));

app.use(httpLogger);
app.use(globalLimiter);
app.use(hpp());
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

app.use(
  helmet({
    contentSecurityPolicy: false, // API-only; enable a full CSP if you serve HTML
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(csrfProtection());

app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({ ok: false, message: "Not found" });
});

app.use(csrfErrorHandler);

app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!err) return next();
  if (res.headersSent) return next(err);
  const message = env.isProd
    ? "Internal Server Error"
    : err instanceof Error
      ? err.message
      : String(err);
  res.status(500).json({ ok: false, message });
});

const server = http.createServer(app);
// Reasonable defaults for high-throughput proxies/load balancers.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 70_000;

async function start(): Promise<void> {
  await connectRedis();
  await connectMongo();
  await ensureDefaultAdmin();
  // Socket adapter needs Redis connected first when REDIS_ENABLED=true.
  initSocket(server);
  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`server running on port ${env.port} (${env.nodeEnv})`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Startup error", err);
  process.exit(1);
});

async function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}, shutting down...`);
  await closeSocket().catch(() => {});
  server.close(async () => {
    await disconnectMongo().catch(() => {});
    await disconnectRedis().catch(() => {});
    process.exit(0);
  });
  // Force exit if connections hang.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
