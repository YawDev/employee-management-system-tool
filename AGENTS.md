<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Employee Management System Tool — agent guide

Next.js 16 / React 19 frontend **and backend-for-frontend (BFF)** for a multi-tenant employee
management platform. This repo owns no database and no business logic — it renders UI and brokers
every call to two .NET 9 services.

Full architecture, diagrams, API tables, and token contract: **[README.md](README.md)**. Read it
before changing anything that crosses a service boundary.

## The platform

| Repo | Role | Dev URL |
| --- | --- | --- |
| this repo | UI + BFF; the only thing a browser talks to | `:3000` |
| [`../employee-management-identity`](../employee-management-identity/) | Auth, roles, JWT issuance + refresh | `:62191` |
| [`../employee-management-microservice`](../employee-management-microservice/) | Org-domain API (tenants → employees) | `:7160` / `:5018` |
| `../employee-management-tool` | **Legacy** frontend. Reference the PRD in its README; never extend the code | — |

Both .NET services share one PostgreSQL database. Their source is on disk — **read it instead of
guessing a payload shape**, or check `/swagger` on a running service.

## Hard rules

**Never call a .NET service from a Client Component.** Identity registers no CORS at all, so it fails
preflight from the browser; and the calls need an `HttpOnly` cookie the client can't read. All
downstream calls go through `lib/data/` on the server.

**Cookie in, bearer out.** Identity delivers tokens as `Set-Cookie` (`access_token`,
`refresh_token`); the microservice reads `Authorization: Bearer`. The BFF translates. Login response
bodies contain `{ User }` only — **there is no token in the payload.**

**Never trust a client-supplied `companyId`.** Tokens carry no tenant claim, and the microservice
verifies role but *not* tenant ownership. Resolve tenant from the session server-side. This app is
currently the only barrier against cross-tenant access.

**Never put `Jwt:Key` in this repo.** The signing key is symmetric and shared by the two .NET
services; holding it would let the BFF mint tokens. Forward tokens, never issue them.

**No `NEXT_PUBLIC_*` for anything downstream** — service URLs, secrets, and tokens are server-only.
Only `lib/data/` reads `process.env`.

**Role slugs are kebab-case**: `sys-admin`, `company-admin`, `manager`, `employee`. The `role` claim
is single-valued, not an array. Policy names differ between the two services — check the right repo.

**`proxy.ts`, not `middleware.ts`.** Renamed in Next 16; the edge runtime is unsupported there
(`nodejs` only, not configurable).

**Use `nameid`, not `sub`, for the user id.** `sub` is set to `UserName`.

## Where code goes

`app/` is routing only. Shared code lives outside it; `@/*` maps to the repo root.

- `app/**/page.tsx` — Server Components by default; add `"use client"` only for interactivity
- `app/**/actions.ts` — `"use server"`; thin, delegates to the DAL
- `app/**/_components/` — colocated, non-routable. Promote to `components/` only on a second consumer
- `lib/data/**` — the DAL. Every file starts `import 'server-only'`. Authorizes, returns DTOs
- `lib/api-client.ts` — base URL, bearer attachment, refresh-on-401
- `components/ui/` — design-system primitives
- `types/` — ambient/cross-cutting types only. Runtime schemas live in `lib/validation/`; infer TS
  types from them rather than hand-writing a parallel set

Don't add `app/api/` routes reflexively — Server Components read and Server Actions mutate without an
HTTP hop. Route Handlers are for real HTTP consumers only (webhooks, external clients, downloads, SSE).

## Downstream quirks that will waste your time

- Route naming is verb-in-path (`/org/get-all-departments/{companyId}`), not REST-by-method
- Refresh tokens are single-use and rotated — concurrent refreshes race; serialize through one path
- `/api/auth/logout` does **not** clear the cookies it set; clear them here
- `/api/auth/identity/{id}` returns `null` (its filter is commented out) — use `/api/auth/user/{id}`
- `ApplicationUser` (auth identity) ≠ `DomainUser` (org person); joined by `DomainUser.IdentityUserId`
- Reporting lines may contain cycles and self-references — never assume the org chart is acyclic
- A mismatched `Jwt:Issuer`/`Jwt:Audience` shows up as a blanket 401 with a token that looks fine
