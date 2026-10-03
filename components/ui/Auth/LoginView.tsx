import Brand from "@/components/ui/Brand";
import LoginForm from "./LoginForm";

export default function LoginView() {
  return (
    <main className="grid min-h-screen md:grid-cols-[5fr_6fr]">
      <aside className="hidden flex-col justify-between bg-navy-900 p-10 md:flex">
        <Brand />

        <div className="max-w-md">
          <h2 className="text-3xl leading-tight font-medium text-white">
            System Portal for the Employee Management Tool
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-navy-200">
            Data management for entities across the platform
          </p>
        </div>

        <p className="flex items-center gap-2 text-xs text-navy-400">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Access restricted to authorized system administrators
        </p>
      </aside>

      <section className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10 md:hidden">
            <Brand dark />
          </div>
          <h1 className="text-2xl font-medium text-navy-900">Sign in</h1>
          <p className="mt-1 mb-8 text-sm text-slate-500">
            Use your EMT administrator account.
          </p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
