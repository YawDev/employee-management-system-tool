import "server-only";
import { User } from "@/types/types";
import type { SystemMeResponse } from "@/types/bff-response";
import { cookies } from "next/headers";
import { createHttpClient, getAuthHeaders } from "../client";
import axios from "axios";
import { cache } from "react";

export type TokenCookie = {
  name: string;
  value: string;
  options: {
    httpOnly: true;
    secure: boolean;
    sameSite: "lax";
    path: "/";
    expires?: Date;
  };
};

export type RefreshResult =
  | { status: "ok"; cookies: TokenCookie[] }
  | { status: "invalid" } // identity rejected the refresh token (401)
  | { status: "error" }; // identity unreachable / 5xx

const TOKEN_COOKIES = ["access_token", "refresh_token"];

// Keeps only the two token cookies from identity's Set-Cookie headers. Also used by login().
const parseTokenCookies = (setCookie: string[] = []): TokenCookie[] => {
  return setCookie.flatMap((header) => {
    const [pair, ...attributes] = header.split(";");
    const [name, value] = pair.trim().split("=");
    if (!TOKEN_COOKIES.includes(name)) return [];

    const expires = attributes
      .map((a) => a.trim())
      .find((a) => a.toLowerCase().startsWith("expires="))
      ?.slice("expires=".length);

    return [
      {
        name,
        value,
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          expires: expires ? new Date(expires) : undefined,
        },
      },
    ];
  });
};

// Identity reads the refresh token from its cookie, so send it as one.
export const refreshSession = async (
  refreshToken: string,
): Promise<RefreshResult> => {
  try {
    const response = await createHttpClient("identity").post(
      "/api/auth/refresh",
      null,
      {
        headers: { Cookie: `refresh_token=${refreshToken}` },
      },
    );
    const tokenCookies = parseTokenCookies(response.headers["set-cookie"]);
    // A 200 without a new access token is unusable; treat it like identity being unreachable.
    if (!tokenCookies.some((c) => c.name === "access_token"))
      return { status: "error" };
    return { status: "ok", cookies: tokenCookies };
  } catch (error) {
    const invalid = axios.isAxiosError(error) && error.response?.status === 401;
    return { status: invalid ? "invalid" : "error" };
  }
};

export const normalizeSystemAdminUser = (payload: SystemMeResponse): User => {
  const data = payload;
  if (!data) throw new Error("System admin user data not found in response");

  return {
    id: data.id,
    userName: data.userName ?? "",
    email: data.email ?? "",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    role: data.role,
  };
};

// Utility function to fetch the current user on the server side
// Wrapped in cache() so the layout and page share one /me call per request.
// Authenticate user before rendering pages and provide user data to components via context
// Keeps user logged in across page refreshes and server-side renders
// Nav bar can use this to conditionally render links based on authentication status
export const getInitialUser = cache(async (): Promise<User | null> => {
  const headers = await getAuthHeaders();
  if (!headers.Authorization) return null;

  try {
    const response = await createHttpClient("identity").get<SystemMeResponse>(
      "/sys-api/auth/admin/me",
      { headers },
    );
    return normalizeSystemAdminUser(response.data);
  } catch (error) {
    // 401/403: no valid session. Anything else (identity down, 500) is a real error.
    if (
      axios.isAxiosError(error) &&
      [401, 403].includes(error.response?.status ?? 0)
    ) {
      return null;
    }
    throw error;
  }
});

export type LoginResult = "ok" | "invalid" | "forbidden";

// Logs in through EMT Identity API and copies its token cookies onto our own domain.
// Returns "invalid" for bad credentials, "forbidden" for a non-sys user; Throws for other errors. (no token returned, server down)
export const login = async (
  userName: string,
  password: string,
): Promise<LoginResult> => {
  try {
    const response = await createHttpClient("identity").post(
      "/sys-api/auth/login",
      { userName, password },
    );

    const tokenCookies = parseTokenCookies(response.headers["set-cookie"]);

    // A 200 OK response should include the access token in the cookies
    // If the access token is not found, it indicates a problem with the login response.
    // Throw an error to indicate the login response is invalid.
    if (!tokenCookies.some((c) => c.name === "access_token")) {
      throw new Error("Access token not found in response cookies");
    }

    const cookieStore = await cookies();
    tokenCookies.forEach((c) => cookieStore.set(c.name, c.value, c.options));
    return "ok";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) return "invalid";
      if (error.response?.status === 403) return "forbidden";
    }
    throw error;
  }
};

// Ends the session in this browser by deleting both token cookies.
export const logout = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
};
