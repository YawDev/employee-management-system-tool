import { NextResponse, type NextRequest } from "next/server";
import {
  RefreshResult,
  refreshSession,
  type TokenCookie,
} from "@/lib/data/identity/auth";

const REFRESH_EARLY_MS = 60_000; // Refresh under 1 minute left

const inFlight = new Map<string, Promise<RefreshResult>>();

// Reads exp from the JWT Body. No signature check: this only decides *when* to
// refresh the session.
function expiresAt(token: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    );
    return (payload.exp ?? 0) * 1000;
  } catch {
    return 0;
  }
}

function refreshOnce(token: string): Promise<RefreshResult> {
  let pending = inFlight.get(token);
  if (!pending) {
    pending = refreshSession(token).finally(() => inFlight.delete(token));
    inFlight.set(token, pending);
  }
  return pending;
}

function withCookies(response: NextResponse, cookies: TokenCookie[]) {
  cookies.forEach((c) => response.cookies.set(c.name, c.value, c.options));
  return response;
}

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/login";
  const access = request.cookies.get("access_token")?.value;
  const refresh = request.cookies.get("refresh_token")?.value;
  let result: RefreshResult | undefined;

  // 1. Access token valid for more than a minute: continue.
  //    (/login decides for itself, via /me, whether to send a signed-in user to "/".)
  if (access && expiresAt(access) > Date.now() + REFRESH_EARLY_MS) {
    return NextResponse.next();
  }

  // 2. Access token missing or expiring, but a refresh token: refresh (not for prefetches).
  if (refresh) {
    if (request.headers.has("next-router-prefetch")) return NextResponse.next();

    result = await refreshOnce(refresh);
    if (result.status === "ok") {
      result.cookies.forEach((c) => request.cookies.set(c.name, c.value)); // this render sees new token
      return withCookies(NextResponse.next({ request }), result.cookies); // browser keeps new token
    }
  }

  // 3. No usable session: show /login, send everything else there.
  const response = isLoginPage
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/login", request.url));

  // Identity rejected the refresh token: clear the dead cookies.
  // (If identity was just unreachable, keep them so the session works once it's back.)
  if (result?.status === "invalid") {
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
  }
  return response;
}

// Skip Next's build files, image optimizer, and anything with a file extension (public/ assets).
export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
