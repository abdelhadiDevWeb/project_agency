import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "access_token";
const ADMIN_ROLES = ["super_admin", "admin"];

type Space = "admin" | "agency";

function spaceForRoles(roles: unknown): Space | null {
  if (!Array.isArray(roles)) return null;
  if (roles.includes("agency")) return "agency";
  if (roles.some((role) => ADMIN_ROLES.includes(role))) return "admin";
  return null;
}

/** Verifies signature, expiry, issuer and audience. Fails closed when the secret is missing. */
async function verifiedSpace(token: string | undefined): Promise<Space | null> {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!token || !secret) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: process.env.JWT_ISSUER ?? "agency_vo",
      audience: process.env.JWT_AUDIENCE ?? "agency_vo",
      algorithms: ["HS256"],
    });
    return payload.sub ? spaceForRoles(payload.roles) : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requested: Space = pathname.startsWith("/admin") ? "admin" : "agency";
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const space = await verifiedSpace(token);

  if (!space) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    const response = NextResponse.redirect(login);
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (space !== requested) {
    return NextResponse.redirect(new URL(`/${space}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/agency/:path*"],
};
