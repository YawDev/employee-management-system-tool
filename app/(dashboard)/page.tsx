import { getCurrentUser, initials } from "@/lib/session";

const environment = process.env.NEXT_PUBLIC_APP_ENV ?? "Local";

export default function OverviewPage() {
  const user = getCurrentUser();
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-navy-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          You&apos;re signed in to the EMT system admin portal.
        </p>
      </div>

      <div className="max-w-md rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-500/10 text-sm font-medium text-navy-500">
            {initials(user.name)}
          </div>
          <div>
            <p className="text-sm font-medium text-navy-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <dl className="grid grid-cols-[120px_1fr] gap-y-3 px-5 py-4 text-sm">
          <dt className="text-slate-500">Role</dt>
          <dd>
            <span className="rounded-full bg-navy-500/10 px-2.5 py-0.5 text-xs text-navy-500">
              {user.role}
            </span>
          </dd>
          <dt className="text-slate-500">Environment</dt>
          <dd>
            <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs text-green-700">
              {environment}
            </span>
          </dd>
        </dl>
      </div>
    </div>
  );
}
