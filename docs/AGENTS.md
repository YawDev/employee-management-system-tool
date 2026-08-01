<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Employee Management System Tool — agent guide

Next.js 16 / React 19 console for **system-level data management**, plus the BFF that serves it.
`sys-admin` users manage system-wide data across every tenant: tenants, organizations, departments,
managers, employees, identity users. No lower permission tier has access, so don't build for one.
Not the tenant-facing app — company admins, managers, and employees use a separate frontend.

Architecture, diagrams, endpoint tables, token claims: **[README.md](README.md)**.

**The backend is still being built.** The README's endpoint tables are a dated snapshot, not a
contract — read the .NET source or `/swagger` for anything you depend on, and don't assume an
endpoint is missing because it isn't listed. Fix the README table when you find drift.

| Repo | Role | Dev URL |
| --- | --- | --- |
| this repo | Console + BFF; the only thing a browser talks to | `:3000` |
| [`../employee-management-identity`](../employee-management-identity/) | Auth + JWT; `/sys-api/*` user admin | `:62191` |
| [`../employee-management-microservice`](../employee-management-microservice/) | Org-domain API; use its `/sys-api/*` | `:7160` / `:5018` |
| `../employee-management-tool` | **Legacy** frontend — PRD reference only, don't extend | — |

## Rules

- **Never call a .NET service from a Client Component.** Identity registers no CORS, so it fails
  preflight; and the calls need an `HttpOnly` cookie the client can't read. Everything goes through
  `lib/data/` on the server.
- **Cookie in, bearer out.** Identity sets `access_token`/`refresh_token` cookies; the microservice
  reads `Authorization: Bearer`. The BFF translates. **Login bodies contain `{ User }` only — no
  token in the payload.**
- **Gate on `role == "sys-admin"`** in `proxy.ts`, and again in Server Actions — those are separately
  reachable POST endpoints the proxy never sees. Exact match on the kebab-case slug.
- **Never put `Jwt:Key` here.** It's symmetric and shared by both .NET services; forward tokens,
  never mint them.
- **No `NEXT_PUBLIC_*` for anything downstream.** Only `lib/data/` reads `process.env`.
- **Stay in the system tier** — don't call `/org/*` or `/report-line-api/*` even though a `sys-admin`
  token is accepted there.
- **`proxy.ts`, not `middleware.ts`** (renamed in Next 16; `nodejs` runtime only).
- **Use `nameid` for the user id**, not `sub` (which is `UserName`).
- `delete-tenant/{id}` cascades through orgs, departments, employees, and managers — confirm before
  firing it.

## Layout

`app/` is routing only; shared code lives outside it. `@/*` maps to the repo root. One audience, so
routes group by resource: `app/login/`, then `app/(console)/` with `tenants/`, `organizations/`,
`departments/`, `managers/`, `employees/`, `users/`.

- Server Components by default; `"use client"` only for interactivity
- `actions.ts` — `"use server"`, thin, re-checks role, delegates to the DAL
- `_components/` — colocated and non-routable; promote to `components/` on a second consumer
- `lib/data/identity/` and `lib/data/system/` — the DAL, split by service because user screens join
  both. Every file starts `import 'server-only'` and returns DTOs
- `lib/validation/` — runtime schemas; infer TS types from them instead of a parallel `types/` set
- Don't add `app/api/` routes by reflex; Server Components read and Server Actions mutate without an
  HTTP hop

## Downstream facts

- `ApplicationUser` (identity login) ≠ `DomainUser` (org person); joined on
  `DomainUser.IdentityUserId`
- No `tenant` claim — correct here; tenant ids are explicit call arguments
- Verb-in-path routes (`/sys-api/get-all-tenants`), not REST-by-method
- Refresh tokens are single-use and rotated — serialize refresh through one path
- Mismatched `Jwt:Issuer`/`Jwt:Audience` → blanket 401 on a token that looks fine
- Not done yet: employees have no system-tier edit/delete; `add-report-to-manager` can create
  cycles; `/api/auth/logout` doesn't clear its cookies; `/api/auth/identity/{id}` returns `null`
  (use `/api/auth/user/{id}`)
