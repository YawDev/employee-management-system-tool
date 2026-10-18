"use server";

import { redirect } from "next/navigation";
import { login, logout } from "@/lib/data/identity/auth";
import axios from "axios";

export type LoginState = { error: string | null; userName?: string };

// Called by login form throw useActionState (previous state, submitted form data).
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const userName = String(formData.get("userName") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  // Re-check on the server side that both username and password are provided;
  // Form's check might have been bypassed, so enforce it on the server side as well.
  if (!userName || !password) {
    return { error: "Username and password are required" };
  }

  try {
    const result = await login(userName, password);
    if (result === "invalid") {
      return { error: "Invalid username or password", userName: userName };
    }
    if (result === "forbidden") {
      return {
        error: "You are not authorized to access the system portal.",
        userName: userName,
      };
    }
  } catch (error) {
    console.error(
      "login failed",
      axios.isAxiosError(error)
        ? {
            status: error.response?.status,
            code: error.code,
            message: error.message,
          }
        : error,
    );

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return { error: "Invalid username or password", userName: userName };
    }

    return {
      error: "An unexpected error occurred during login. Try again.",
      userName: userName,
    };
  }

  redirect("/");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
