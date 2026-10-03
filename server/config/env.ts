import "dotenv/config";
import Joi from "joi";

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "production").default("development"),
  PORT: Joi.number().port().default(4000),

  MONGODB_URI: Joi.string().uri({ scheme: [/mongodb(\+srv)?/] }).required(),

  // Comma-separated list of allowed origins. Example:
  // CORS_ORIGINS=http://localhost:3000,https://app.example.com
  CORS_ORIGINS: Joi.string().default("http://localhost:3000"),

  // JWT auth
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_ISSUER: Joi.string().default("agency_vo"),
  JWT_AUDIENCE: Joi.string().default("agency_vo"),

  // Cookie / CSRF (required for signed cookies even if CSRF is off)
  COOKIE_SECRET: Joi.string().min(32).required(),
  CSRF_ENABLED: Joi.boolean().default(false),

  // When behind a proxy (nginx, cloudflare, render, etc) set to 1 (or "true")
  TRUST_PROXY: Joi.alternatives()
    .try(Joi.boolean(), Joi.number().integer().min(0).max(10), Joi.string())
    .default(false),

  // Socket security — prefer true in production
  SOCKET_REQUIRE_AUTH: Joi.boolean().default(false),

  // Demo POST /api/auth/token — forced off in production unless explicitly true (still blocked)
  ALLOW_DEMO_AUTH: Joi.boolean().default(true),

  // First super admin, created on boot only if no admin with this email exists yet
  DEFAULT_ADMIN_EMAIL: Joi.string().trim().lowercase().email().optional(),
  DEFAULT_ADMIN_PASSWORD: Joi.string().min(8).max(128).optional(),
  DEFAULT_ADMIN_NAME: Joi.string().trim().max(120).default("Super Admin"),

  // Redis (recommended for scaling across multiple instances)
  REDIS_ENABLED: Joi.boolean().default(false),
  REDIS_URL: Joi.when("REDIS_ENABLED", {
    is: true,
    then: Joi.string().uri().required(),
    otherwise: Joi.string().uri().optional(),
  }),
}).unknown(true);

const { value, error } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  convert: true,
});

if (error) {
  // Fail fast on boot rather than running insecurely/misconfigured.
  throw new Error(`Invalid environment configuration:\n${error.message}`);
}

function parseOrigins(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const nodeEnv = value.NODE_ENV as "development" | "test" | "production";
const isProd = nodeEnv === "production";

// Fail-closed in production: never mint demo tokens; always require socket JWT.
const allowDemoAuth = isProd ? false : (value.ALLOW_DEMO_AUTH as boolean);
const socketRequireAuth = isProd ? true : (value.SOCKET_REQUIRE_AUTH as boolean);

export const env = {
  nodeEnv,
  isProd,
  port: value.PORT as number,
  mongoUri: value.MONGODB_URI as string,
  corsOrigins: parseOrigins(value.CORS_ORIGINS as string),
  trustProxy: value.TRUST_PROXY as boolean | number | string,

  jwt: {
    accessSecret: value.JWT_ACCESS_SECRET as string,
    issuer: value.JWT_ISSUER as string,
    audience: value.JWT_AUDIENCE as string,
  },

  cookieSecret: value.COOKIE_SECRET as string,
  csrfEnabled: value.CSRF_ENABLED as boolean,

  socketRequireAuth,
  allowDemoAuth,

  defaultAdmin: {
    email: value.DEFAULT_ADMIN_EMAIL as string | undefined,
    password: value.DEFAULT_ADMIN_PASSWORD as string | undefined,
    name: value.DEFAULT_ADMIN_NAME as string,
  },

  redis: {
    enabled: value.REDIS_ENABLED as boolean,
    url: value.REDIS_URL as string | undefined,
  },
};
