# Server Security Notes (Best Practices)

This document explains the security hardening currently implemented in `server/`, how to configure it with `.env`, and what is still required before production use.

> Important: security is a system. Middleware helps, but **real security requires real auth, real secrets, and correct deployment settings**.

---

## 1) Environment & secrets (fail-fast)

**File:** `server/config/env.ts`

- Loads `.env` via `dotenv`.
- Validates required configuration via `joi`.
- If configuration is missing/invalid, the server **throws on startup** (fail-fast).

### Setup

```bash
copy .env.example .env
# then replace JWT_ACCESS_SECRET and COOKIE_SECRET with real random values (min 32 chars)
```

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Required `.env` keys

**File:** `server/.env` (ignored by git via `server/.gitignore`)

- `MONGODB_URI`: MongoDB connection string.
- `PORT`: HTTP port.
- `NODE_ENV`: `development` | `test` | `production`
- `CORS_ORIGINS`: comma-separated allowlist.
- `JWT_ACCESS_SECRET`: **required**, minimum 32 chars.
- `COOKIE_SECRET`: **required**, minimum 32 chars.
- `CSRF_ENABLED`: `true|false`
- `SOCKET_REQUIRE_AUTH`: `true|false` (forced **true** when `NODE_ENV=production`)
- `ALLOW_DEMO_AUTH`: `true|false` (forced **false** when `NODE_ENV=production`)
- `TRUST_PROXY`: `false` or `1` (or similar) when behind a proxy.
- `REDIS_ENABLED` / `REDIS_URL`: optional shared rate limits + Socket.IO adapter.

### Production requirement (critical)

- **Replace placeholder secrets** in `.env` with real random secrets.
- Never commit secrets to git.
- `ALLOW_DEMO_AUTH` cannot stay on in production (code forces it off).

---

## 2) HTTP server bootstrap

**File:** `server/index.ts`

### CORS (allowlist)

- Only requests from `CORS_ORIGINS` are allowed.
- Requests with no `Origin` header (server-to-server / curl) are allowed.
- Rejected origins use `callback(null, false)` (no 500 throw).
- `credentials: true` is enabled.
- `X-Powered-By` is disabled.

### Request size limits

- `express.json({ limit: "64kb" })`
- `express.urlencoded({ limit: "64kb" })`

### Secure cookie parsing

- `cookie-parser` uses `COOKIE_SECRET` so signed cookies can be validated.

### Logging with redaction

**File:** `server/middleware/logger.ts`

- Uses `pino-http` only (no morgan).
- Redacts:
  - `Authorization` header
  - `Cookie` header
  - `Set-Cookie` headers

### Rate limiting (layered)

**File:** `server/middleware/rateLimiters.ts`

- `globalLimiter`: applied to all requests.
- `authLimiter`: stricter limiter for auth endpoints.
- Uses Redis store when `REDIS_ENABLED=true`.

### HPP protection

- Uses `hpp()` to mitigate HTTP Parameter Pollution attacks.

### Mongo query sanitization

- Uses `express-mongo-sanitize` to prevent `$` / `.` key operator injection patterns.

### Helmet security headers

- `helmet()` enables a suite of security headers.
- CSP is off for this API-only server; define a full CSP if you serve HTML later.

### CSRF protection (optional)

**File:** `server/middleware/csrf.ts`

- If `CSRF_ENABLED=false`, CSRF middleware is a no-op.
- If `CSRF_ENABLED=true`, CSRF protection is enabled using a **signed, httpOnly cookie**.
- Note: `csurf` is unmaintained — prefer a modern CSRF library if you adopt cookie sessions.

When to enable:
- Enable **only if you use cookies for auth** (browser automatically attaches cookies → CSRF matters).
- For pure Bearer-token APIs, CSRF can remain disabled.

### 404 + errors

- Unknown routes return `{ ok: false, message: "Not found" }` with status 404.
- Production 500 responses hide internal error details.

---

## 3) Authentication & authorization (JWT)

**File:** `server/middleware/auth.ts`

- `requireAuth`: validates the JWT from `Authorization: Bearer <token>` or the `access_token` cookie using:
  - `JWT_ACCESS_SECRET`
  - `JWT_ISSUER`
  - `JWT_AUDIENCE`
- Attaches `req.user = { sub, roles? }`
- `requireRole(...roles)`: passes when the user has any of the given roles.

### Accounts and login

**Files:** `server/models/Agency.ts`, `server/models/Admin.ts`, `server/services/accounts.ts`, `server/routes/auth.ts`

- Two collections: `agency` (role `agency`) and `admin` (role `super_admin` or `admin`).
- Passwords are hashed with bcrypt (cost 12, `Bun.password`) in a `pre("save")` hook and are `select: false`.
- `POST /api/auth/login` checks the `agency` collection first, then `admin`. Any failure returns the same
  `401 Incorrect email or password.`; unknown emails still run a hash comparison so timing does not reveal
  which emails exist. Rate limited by `authLimiter` (10/min).
- On success the JWT (8 h) is set as an `httpOnly`, `SameSite=Lax` cookie (`Secure` in production).
  The Next.js app proxies `/api/*` to this server so the cookie is first-party.
- The first super admin is created on boot from `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD` if that email
  is not in `admin` yet. An existing admin is never overwritten; the password can be removed from `.env` afterwards.

**Still recommended before production:** account lockout/backoff per email, refresh tokens or shorter sessions,
and `CSRF_ENABLED=true` if you add cookie-authenticated form posts from other sites.

`POST /api/auth/token` remains a **demo** endpoint gated by `ALLOW_DEMO_AUTH` (always disabled when `NODE_ENV=production`).

---

## 4) Request validation

**File:** `server/middleware/validate.ts`

- Central Joi-based request validation for:
  - `body`, `query`, `params`, `headers`
- Returns `400` with safe, structured validation errors.

Best practice:
- Add a schema to **every mutating route**.
- Never pass raw client objects directly into Mongo queries.

---

## 5) Routes

**File:** `server/routes/index.ts`

Endpoints currently present:

- `GET /api/health`
  - Checks Mongo (and Redis when enabled). Returns 503 if a required dependency is down.
- `POST /api/auth/token`
  - **Demo token minting** (blocked in production).
  - Protected by `authLimiter` and Joi validation.
- `POST /api/auth/login` / `POST /api/auth/logout`
  - Login sets the session cookie; logout clears it.
- `GET /api/me`
  - Protected by `requireAuth`. Returns the signed-in agency or admin profile (never the password).
- `POST /api/admin/agencies`
  - `super_admin` / `admin` only. Creates an agency; requires a strong password and at least one phone number.

---

## 6) Socket.IO hardening

**File:** `server/socket/index.ts`

- Redis is connected **before** the Socket.IO adapter is attached.
- Optional handshake auth:
  - If `SOCKET_REQUIRE_AUTH=true` (always in production), the server requires a JWT at connect time:
    - `socket.handshake.auth.token`
  - Token is verified with the same JWT issuer/audience/secret; `socket.data.user` is set.

Best practice:
- Even with handshake auth, validate and authorize each event payload (and room joins) server-side.

---

## 7) Database

**File:** `server/db/mongoose.ts`

- Connects to MongoDB via Mongoose.
- `autoIndex` disabled in production for safety/performance.

Best practice:
- Use proper indexes via migrations/ops or carefully managed schema indexes.

---

## 8) Deployment hardening checklist (recommended)

These are outside code but required for “high security”:

- TLS termination (HTTPS) at a trusted proxy/load balancer.
- Set `TRUST_PROXY` correctly when behind a proxy (so secure cookies / rate limit IP work properly).
- Secrets management (do not store production secrets in local `.env` files).
- Monitoring & alerting:
  - Auth failures, rate limit hits, 5xx spikes
  - Mongo connection health
- Dependency hygiene:
  - Remove unused packages as the stack evolves.
- Logging policy:
  - Ensure no secrets in URLs or request bodies.

---

## 9) Quick verification commands

From `server/`:

```bash
bun x tsc -p tsconfig.json --noEmit
```

Run server (dev):

```bash
bun run dev
```

Health check:

```bash
curl http://localhost:4000/api/health
```
