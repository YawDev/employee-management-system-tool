"use client";

import { useActionState, useState, type FormEvent } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function LoginForm() {
  const initialState: LoginState = { error: null };

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setClientError(null);

    const form = new FormData(event.currentTarget);
    const username = String(form.get("userName") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!username || !password) {
      event.preventDefault();
      setClientError("Enter your username and password.");
      return;
    }

    setClientError(null);
  }

  const error = clientError ?? state.error;

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4"
    >
      <TextField
        id="userName"
        name="userName"
        type="text"
        label="User ID"
        autoComplete="userName"
        placeholder="SystemAdmin"
        defaultValue={state.userName ?? ""}
        onChange={() => setClientError(null)}
      />

      <TextField
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        autoComplete="current-password"
        onChange={() => setClientError(null)}
        labelAction={
          <a href="#" className="text-xs text-navy-500 hover:underline">
            Forgot password?
          </a>
        }
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="px-3 text-xs font-medium text-slate-500 hover:text-navy-900"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        }
      />

      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        loading={pending}
        loadingText="Signing in…"
        className="mt-2 w-full"
      >
        Sign in
      </Button>
    </form>
  );
}
