# apps-store

An open-source catalog for discovering, managing and launching an enterprise's
internal web applications from one dashboard. Self-hosted: a company runs the
whole stack on its own infrastructure.

## Read this first — where the project actually is

The frontend is real and working. **Everything else is designed but not built.**

| Part                               | State                                                     |
| ---------------------------------- | --------------------------------------------------------- |
| `webapp/`                          | Built. TanStack Start + React 19, runs against a mock API |
| `backend/`                         | **Does not exist yet.** NestJS, planned                   |
| PostgreSQL, Keycloak, Redis, MinIO | **Not set up.** Designed in `docs/architecture.md`        |
| Auth                               | **Not implemented.** No login exists today                |

Do not describe planned components as if they exist, and do not write code that
imports from `backend/`. If a task needs the backend, say so.

The data the UI reads today comes from **Mockoon**, not a database — see
`webapp/mock/apps-store.json`.

Backend code lives in `backend/` at the repo root, never inside `webapp/`. Do not
let the word “api” mislead you: the NestJS **service** is named `api` (compose
service and network hostname), it serves **`/api/v1`**, and the browser calls
**`/api/*`** on webapp which proxies through. The **folder** is `backend/`.

## Documentation map

Read the doc that matches the task before writing code. `docs/architecture.md`
is the specification: if code and that file disagree, the file wins until a
human says otherwise.

| Document                                                        | Read it when                                                            |
| --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [docs/architecture.md](docs/architecture.md)                    | Anything touching data model, auth, roles, or API shape. The full spec. |
| [docs/state-management.md](docs/state-management.md)            | Any change to data fetching, the Zustand store, or a query hook.        |
| [EERD PNG](<docs/EERD — apps-store data model.png>)             | You need the tables and relationships at a glance.                      |
| [Architecture PNG](<docs/System Architecture — apps-store.png>) | You need the runtime components and how they talk.                      |
| [docs/apps-store.png](docs/apps-store.png)                      | Product screenshot, for README and orientation.                         |

Sections of `docs/architecture.md` worth jumping to directly:

- §2 Decisions — the four load-bearing choices and why
- §3 Database design — every table and column
- §4 ORM and schema — the full `schema.prisma`
- §5 Roles and permissions — the permission matrix and the visibility rule
- §6 Login and token flow — Keycloak config, the nine-step sequence, env vars
- §7 API design — every endpoint with its required role, error and list shapes
- §8 Known gaps — what is deliberately deferred; check before "fixing" something

Design source of truth for UI lives in Figma:
`https://www.figma.com/design/cDTpWX5NpLSFrMMUR0UUJz/Open-Source-Apps-Store`
(`high-fidelity` page for screens, `Diagrams` page for the three architecture
boards, including an auth-flow walkthrough not exported here).

## Commands

Run from `webapp/`. **The package manager is `bun`** (`bun.lock` is committed;
ignore the `"packageManager": "npm"` left over in `.cta.json`).

```bash
bun run mock     # Mockoon API on :3001 — start this first
bun run dev      # app on :3000
bun run test     # vitest
bun run test:e2e # playwright; boots mock + dev itself unless E2E_BASE_URL is set
bun run lint     # eslint
bun run format   # prettier --write + eslint --fix
bun run check    # prettier --check
```

`bun run dev` without `bun run mock` gives an app with no data. Both are needed.

## Architecture invariants

These come from `docs/architecture.md` §2. Breaking one is a design change, not
a refactor — raise it rather than doing it quietly.

1. **No token ever reaches the browser.** The TanStack Start server (the BFF)
   holds access and refresh tokens; the browser gets one opaque `HttpOnly`
   session cookie. Nothing auth-related goes in `localStorage` or
   `sessionStorage`, ever.
2. **Authorization is enforced in the API, in the query.** List endpoints filter
   rows by the caller's groups in SQL. Frontend hiding is cosmetic — never the
   thing that protects data.
3. **Keycloak owns group membership; Postgres only mirrors group records.**
   Membership arrives in the token on each request. Never write membership to
   the database, and never add UI for editing it.
4. **The provider is bundled, not hardcoded.** Everything is derived at boot
   from `AUTH_ISSUER_URL` + `/.well-known/openid-configuration`. No Keycloak
   URL, realm path, or claim name may be written as a literal in source.
5. **`sub` is the user key**, never email. Emails change.
6. **Roles come from config**, never string literals — `AUTH_ROLE_MAP` maps
   claim values to `viewer` / `editor` / `admin`.
7. **A resource the caller may not see returns `404`, not `403`.** A 403
   confirms the resource exists.

## Frontend conventions

**Data flow** — the one rule from `docs/state-management.md`: query hooks fetch
and write into the Zustand store; components read from the store, never from the
query result. A mutation's job ends at `invalidateQueries` — do not also patch
the store by hand.

**Imports** — use the `@/...` alias (`@/components`, `@/queries`, `@/store`,
`@/types`). `tsconfig.json` also defines bare aliases like `@constants/*`, but
`@/...` is what the codebase overwhelmingly uses; match it. Two traps: the
`@types/*` alias shadows the npm `@types` namespace, and the `#/*` entry in
`package.json` is vestigial — do not use it.

**Routes vs views** — `src/routes/` holds thin TanStack Router files (file-based
routing). The actual screens live in `src/views/`, mirroring the route tree. Put
logic in the view, not the route.

**Never hand-edit `src/routeTree.gen.ts`.** It is generated — run
`bun run generate-routes`.

**Components** — shadcn/ui in `src/components/ui/` (style `base-nova`, `lucide`
icons, Tailwind v4 with CSS variables in `src/styles.css`). Shared components sit
in `src/components/`. Do not edit `ui/` primitives to fix a one-off; wrap them.

**Class names** — prettier handles Tailwind sorting and long-classname wrapping
(`prettier-plugin-tailwindcss`, `prettier-plugin-classnames`,
`prettier-plugin-merge`). Do not manually split class strings across `cn()`
calls to keep lines short; write them inline and run `bun run format`. `cn()` is
for conditional and merged classes only.

**Design tokens** — colors and typography come from the Figma-exported token
pipeline in `src/styles.css`. Use the token, not a raw hex or arbitrary value.

## Testing

- **Vitest** for units, alongside the code.
- **Playwright** in `webapp/testing/`, config at `testing/playwright.config.ts`.
  Specs drive the real Vite dev server so Tailwind's compiled theme is under
  test. Chip sizing is asserted to a tenth of a pixel and
  `deviceScaleFactor` is pinned — do not change it.
- Snapshots live in `testing/*-snapshots/` and are platform-tagged
  (`-chromium-darwin`). Regenerate deliberately, never to make a test pass.
- Keep `mock/apps-store.json` — Playwright boots it, and it stays useful for
  frontend work after the real API lands.

## Git workflow

Work happens on `dev`; `main` is protected and merged via PR. Feature branches
are `feature/<name>`. Commits are conventional (`feat:`, `fix:`, `refactor:`,
`test:`, `chore:`, `style:`) with a lowercase, imperative subject.

Do not commit or push unless asked.

## When a decision changes

`docs/architecture.md`, the Figma diagram boards, and the code are three views of
the same design. Change the doc in the same commit as the code, and say if a
Figma board has gone stale. A diagram nobody trusts is worse than none.
