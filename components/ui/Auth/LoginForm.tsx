"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSubmitting(true);
    // TODO: call the BFF login endpoint once it exists.
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <TextField
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="username"
        placeholder="admin@company.com"
        onChange={() => setError(null)}
      />

      <TextField
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        autoComplete="current-password"
        onChange={() => setError(null)}
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
        loading={submitting}
        loadingText="Signing in…"
        className="mt-2"
      >
        Sign in
      </Button>
    </form>
  );
}
