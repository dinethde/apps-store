# Architecture

Status: **proposed** — 2026-08-29; sections 3, 4 and 7 are **implemented** in
`backend/` as of 2026-09-02, without the authentication of sections 5 and 6.
Everything here is a decision, not a suggestion. Change any of it, but change it
_here_ first, then in code.

Scope: decisions, data model, roles, login flow, and the API contract.
Diagrams and the implementation plan live elsewhere (see [Next](#next)).

## Contents

1. [Context](#1-context)
2. [Decisions](#2-decisions)
3. [Database design](#3-database-design)
4. [ORM and schema](#4-orm-and-schema)
5. [Roles and permissions](#5-roles-and-permissions)
6. [Login and token flow](#6-login-and-token-flow)
7. [API design](#7-api-design)
8. [Known gaps](#8-known-gaps)

## 1. Context

apps-store is a catalog of an enterprise's internal web applications. Employees
browse and launch apps; a small number of them administer the catalog. It is
open source and self-hosted: a company runs the whole thing on its own
infrastructure.

Five processes, all in one `docker compose`:

| Process    | What it is                    | Port   |
| ---------- | ----------------------------- | ------ |
| `webapp`   | TanStack Start (React 19)     | `3000` |
| `backend`  | NestJS                        | `4000` |
| `postgres` | apps-store's database         | `5432` |
| `keycloak` | The bundled identity provider | `8080` |
| `redis`    | BFF session store             | `6379` |

Keycloak keeps its own database. Do not point it at apps-store's.

The repository is a monorepo: `webapp/` exists today, `backend/` is added in
the backend phase.

## 2. Decisions

Four decisions. Everything in sections 3–7 follows from them.

### 2.1 The bundled identity provider is Keycloak

apps-store ships **Keycloak** (Apache-2.0) as a service in its compose file,
with a single realm named `apps-store`.

**Why.** It is what enterprises already run, so an adopter's security team
recognises it. Its licence is permissive, which matters for a bundled
dependency. Its vocabulary — realm, client, group, role — is the vocabulary
every other provider copies, so nothing learned here is wasted.

**Consequence — the escape hatch.** Bundling is not hardcoding. The backend
and the web server locate the provider through **one** environment variable:

```
AUTH_ISSUER_URL=http://keycloak:8080/realms/apps-store
```

Every other address (authorize, token, JWKS, end-session) is read at boot from
`${AUTH_ISSUER_URL}/.well-known/openid-configuration`. No Keycloak-specific URL
is ever written in source. An adopter who already runs Entra ID or Okta changes
that one variable and the bundled container is simply not started.

**Rejected.** Ory and Zitadel (fine products; AGPL in Zitadel's case makes a
bundled default awkward). Writing our own IdP (never). Better Auth's OIDC
provider plugin (its own docs say it is not production ready).

### 2.2 Keycloak owns group membership; Postgres mirrors group records

This is the load-bearing decision. `App.userGroupIds` already exists in the
frontend, so groups live in two systems and one of them has to be the truth.

- **Membership** — who is in `finance` — belongs to Keycloak, always. apps-store
  never adds or removes a member, and has no UI for it.
- **Group records** — the id and name of `finance` — are mirrored into the
  `user_groups` table, so that `app_user_groups` can be a real foreign key and
  the admin screens can offer a picker.

Membership reaches the backend in the token on every request. It is never
read from the database.

**Why.** HR moves an employee between departments in the corporate directory,
not in an app catalog. Storing membership locally would guarantee it goes
stale, and would make apps-store a second place to audit during an access
review.

**Consequence.** The mirror needs a sync job — see [6.1](#61-keycloak-setup)
and [8](#8-known-gaps).

### 2.3 Tokens live on the web server, never in the browser

The TanStack Start server acts as a **backend for frontend** (BFF).

| Where           | Holds                                                  |
| --------------- | ------------------------------------------------------ |
| Browser         | One opaque session cookie. Nothing else.               |
| `webapp` server | Access + refresh tokens, in Redis, keyed by session id |
| `backend`       | Nothing. It verifies each request's token from scratch |

The browser never receives an access token, an ID token, or a refresh token,
and nothing auth-related is written to `localStorage` or `sessionStorage`.

**Why.** Any script that runs on the page can read anything JavaScript can
read. Keeping tokens out of the browser removes that whole class of problem,
and it is what RFC 10017 recommends. It also lets `apps-store-web` be a
_confidential_ OAuth client — one that can hold a secret — which a pure
single-page app cannot be.

**Consequence.** All browser traffic goes through the web server. The browser
never calls `backend` directly, which also means CORS between them is not a
thing we need.

**Why Redis and not the cookie.** Sealing the tokens into the cookie itself
would avoid a container, but a Keycloak token for a user in many groups can
exceed the 4 KB cookie limit — and the failure is silent and confusing. Redis
costs one compose service and removes the ceiling.

### 2.4 Authorization is enforced in the backend, in the query

The frontend hides things. The backend decides them. These are not the same
job and the frontend's version is not security.

1. Every endpoint states the role it requires, enforced by a guard.
2. Every list endpoint filters rows by the caller's groups **in the database
   query**, not after fetching.
3. The frontend hiding an admin button is cosmetic. The endpoint behind it
   returns `403` regardless.

**Why.** If `GET /apps` returned all 200 apps and the UI displayed 20, the other
180 would be one devtools tab away. Group-scoped visibility is a confidentiality
promise, so it has to hold at the layer that reads the data.

**Consequence for existing code.** `webapp` currently filters by group in
Zustand. That filter stays for the _tag_ and _liked_ filters, which are
presentation. Group filtering moves server-side.

## 3. Database design

One PostgreSQL database, owned by `backend`. Nothing else connects to it.

### 3.1 Conventions

1. Primary keys are UUIDs generated by the application, not sequences.
2. Table and column names are `snake_case`; the Prisma client and the API use
   `camelCase`. The mapping lives in the schema, not in hand-written SQL.
3. Every mutable table has `created_at` and `updated_at` as `timestamptz`.
   Timestamps are stored and returned in UTC.
4. Deletes are soft where an audit trail matters (`apps`), hard where it does
   not (`favorites`, join rows).
5. No table stores a password, a password hash, or a token. Ever.

### 3.2 Tables

**`users`** — one row per person who has logged in at least once. Rows are
created automatically on first login (see [6.4](#64-first-login)).

| Column          | Type          | Notes                                |
| --------------- | ------------- | ------------------------------------ |
| `id`            | `uuid` PK     | apps-store's own id                  |
| `idp_subject`   | `text` unique | The token's `sub`. The real join key |
| `email`         | `citext`      | From the token; may change over time |
| `display_name`  | `text`        | From the token                       |
| `last_login_at` | `timestamptz` | Updated on each login                |
| `created_at`    | `timestamptz` |                                      |

`idp_subject` is the identity, not `email`. People change their email address;
`sub` never changes.

**`user_groups`** — the mirror from decision [2.2](#22-keycloak-owns-group-membership-postgres-mirrors-group-records).
Written only by the sync job.

| Column         | Type          | Notes                          |
| -------------- | ------------- | ------------------------------ |
| `id`           | `uuid` PK     |                                |
| `idp_group_id` | `text` unique | Keycloak's group id            |
| `name`         | `text`        | Display name, e.g. `Finance`   |
| `path`         | `text`        | Keycloak path, e.g. `/finance` |
| `synced_at`    | `timestamptz` | Last time the sync job saw it  |

**`apps`** — the catalog.

| Column            | Type               | Notes                              |
| ----------------- | ------------------ | ---------------------------------- |
| `id`              | `uuid` PK          |                                    |
| `name`            | `text`             |                                    |
| `url`             | `text`             | Where the tile launches            |
| `version`         | `text`             |                                    |
| `tagline`         | `text`             | Short line on the tile             |
| `description`     | `text`             |                                    |
| `status`          | `app_status`       | `DRAFT` / `PUBLISHED` / `ARCHIVED` |
| `icon_name`       | `text` null        |                                    |
| `icon_size_label` | `text` null        |                                    |
| `icon_url`        | `text` null        |                                    |
| `created_by_id`   | `uuid` null FK     | → `users.id`                       |
| `created_at`      | `timestamptz`      |                                    |
| `updated_at`      | `timestamptz`      |                                    |
| `deleted_at`      | `timestamptz` null | Soft delete                        |

There is no `updated_by_id`. It was listed here once and never in the schema;
the column waits for [6](#6-login-and-token-flow), because until a request
carries an identity there is no actor to write into it.

`status` is an enum, not the boolean the frontend has today.

1. `DRAFT`
2. `PUBLISHED`
3. `ARCHIVED`

Deletion is not a status. `deleted_at` carries it, so a soft-deleted app keeps
whichever of the three it had.

[7.6](#76-what-changes-in-webapp) for the frontend impact.

**`tags`** — unchanged from the current shape.

| Column      | Type          | Notes                             |
| ----------- | ------------- | --------------------------------- |
| `id`        | `uuid` PK     |                                   |
| `name`      | `text` unique |                                   |
| `color`     | `text`        | Design-token name, not a hex code |
| `is_active` | `boolean`     | Default `true`                    |

A tag is on or off, so it stays a boolean. Only `apps` gets the enum.

**`app_tags`** — join, `(app_id, tag_id)` composite PK.

**`app_user_groups`** — join, `(app_id, user_group_id)` composite PK. This is
what `App.userGroupIds` becomes, and what
[2.4](#24-authorization-is-enforced-in-the-backend-in-the-query) filters on.
An app with **no** rows here is visible to every authenticated
user — that is the "company-wide" case, and it must be deliberate.

**`favorites`** — `(user_id, app_id)` composite PK, plus `created_at`. Replaces
the browser-only `likedAppIds` in the Zustand store, so favourites survive a
refresh and follow the user between devices.

**`audit_log`** — append-only.

| Column        | Type           | Notes                              |
| ------------- | -------------- | ---------------------------------- |
| `id`          | `uuid` PK      |                                    |
| `actor_id`    | `uuid` null FK | → `users.id`; null for system jobs |
| `action`      | `text`         | e.g. `app.updated`                 |
| `entity_type` | `text`         | `app` / `tag` / `app_user_groups`  |
| `entity_id`   | `text`         |                                    |
| `changes`     | `jsonb` null   | `{ before, after }`, changed keys  |
| `created_at`  | `timestamptz`  |                                    |

Every write endpoint appends one row. Access reviews are the reason an
enterprise tool gets approved, and this is the cheapest version of one.

### 3.3 Indexes worth having on day one

- `users(idp_subject)` — unique, hit on every request.
- `user_groups(idp_group_id)` — unique, hit by the sync job.
- `app_user_groups(user_group_id)` — the visibility query joins on it.
- `apps(status)` where `deleted_at is null` — the catalog list.
- `audit_log(entity_type, entity_id, created_at desc)` — the entity history view.

### 3.4 What the database deliberately does not hold

- Passwords, MFA secrets, or anything a credential could be recovered from.
- Group _membership_. It arrives in the token.
- Access or refresh tokens. Those live in Redis, held by `webapp`.
- The role of a user. It is derived from the token on each request, so revoking
  a role in Keycloak takes effect within one token lifetime.

## 4. ORM and schema

### 4.1 Prisma

**Decision: Prisma.** The schema file is a single readable description of the
database that doubles as documentation; migrations are one command; the
generated client is fully typed. TypeORM is the other common NestJS choice and
is a defensible swap, but its entity decorators scatter the schema across the
codebase, which is the wrong trade while the model is still moving.

`backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum AppStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model User {
  id          String    @id @default(uuid())
  idpSubject  String    @unique @map("idp_subject")
  email       String
  displayName String    @map("display_name")
  lastLoginAt DateTime? @map("last_login_at")
  createdAt   DateTime  @default(now()) @map("created_at")

  createdApps App[]       @relation("AppCreatedBy")
  favorites   Favorite[]
  auditEvents AuditLog[]

  @@map("users")
}

model UserGroup {
  id         String   @id @default(uuid())
  idpGroupId String   @unique @map("idp_group_id")
  name       String
  path       String
  syncedAt   DateTime @default(now()) @map("synced_at")

  apps AppUserGroup[]

  @@map("user_groups")
}

model App {
  id            String    @id @default(uuid())
  name          String
  url           String
  version       String
  tagline       String
  description   String
  status        AppStatus @default(DRAFT)
  iconName      String?   @map("icon_name")
  iconSizeLabel String?   @map("icon_size_label")
  iconUrl       String?   @map("icon_url")
  createdById   String?   @map("created_by_id")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  createdBy  User?          @relation("AppCreatedBy", fields: [createdById], references: [id])
  tags       AppTag[]
  userGroups AppUserGroup[]
  favorites  Favorite[]

  @@index([status])
  @@map("apps")
}

model Tag {
  id       String  @id @default(uuid())
  name     String  @unique
  color    String
  isActive Boolean @default(true) @map("is_active")

  apps AppTag[]

  @@map("tags")
}

model AppTag {
  appId String @map("app_id")
  tagId String @map("tag_id")

  app App @relation(fields: [appId], references: [id], onDelete: Cascade)
  tag Tag @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([appId, tagId])
  @@map("app_tags")
}

model AppUserGroup {
  appId       String @map("app_id")
  userGroupId String @map("user_group_id")

  app       App       @relation(fields: [appId], references: [id], onDelete: Cascade)
  userGroup UserGroup @relation(fields: [userGroupId], references: [id], onDelete: Cascade)

  @@id([appId, userGroupId])
  @@index([userGroupId])
  @@map("app_user_groups")
}

model Favorite {
  userId    String   @map("user_id")
  appId     String   @map("app_id")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  app  App  @relation(fields: [appId], references: [id], onDelete: Cascade)

  @@id([userId, appId])
  @@map("favorites")
}

model AuditLog {
  id         String   @id @default(uuid())
  actorId    String?  @map("actor_id")
  action     String
  entityType String   @map("entity_type")
  entityId   String   @map("entity_id")
  changes    Json?
  createdAt  DateTime @default(now()) @map("created_at")

  actor User? @relation(fields: [actorId], references: [id])

  @@index([entityType, entityId, createdAt(sort: Desc)])
  @@map("audit_log")
}
```

### 4.2 Migrations and seed

- `prisma migrate dev` in development, `prisma migrate deploy` in the container
  entrypoint. Migrations are committed; the database is never changed by hand.
- `prisma/seed.ts` mirrors `webapp/mock/apps-store.json` — the same app, tags
  and groups the mock serves — so the UI looks identical against either. It is
  idempotent, so re-running it is safe. The mock's ids are not UUIDs, so the
  seed uses fixed UUIDs with the mock's content.
- It also inserts the one `users` row that
  [7.7](#77-what-is-built-today) resolves every caller to.
- Seeded `user_groups` rows will need the same `idp_group_id` values as the
  committed Keycloak realm export, so the two seeds line up on a fresh
  `compose up`. Today they are derived from the group path.

## 5. Roles and permissions

### 5.1 Two independent axes

Two questions get confused constantly. Keep them apart and the code stays
small.

| Axis           | Question            | Source                        |
| -------------- | ------------------- | ----------------------------- |
| **Role**       | What may you _do_?  | Keycloak **realm roles**      |
| **Visibility** | What may you _see_? | Keycloak **group membership** |

They do not interact. An editor in Finance may edit apps, and still sees only
Finance's apps. An admin sees everything. Two switches, thrown separately.

This is also why the two use different Keycloak features: realm roles for the
three platform roles, groups for the org chart. Mixing them into one list is
the usual mistake and it makes the mapping ambiguous forever after.

### 5.2 The three roles

| Role     | Who                                       |
| -------- | ----------------------------------------- |
| `viewer` | Every authenticated employee. The default |
| `editor` | Maintains catalog entries and tags        |
| `admin`  | Also controls visibility, sync, and audit |

Three is enough. Add a fourth only when a real person is blocked by having none
of these.

### 5.3 Permission matrix

| Action                            | viewer | editor | admin |
| --------------------------------- | :----: | :----: | :---: |
| List visible apps                 |   ✓    |   ✓    |   ✓   |
| Open an app / read its detail     |   ✓    |   ✓    |   ✓   |
| Favourite an app                  |   ✓    |   ✓    |   ✓   |
| List tags and groups              |   ✓    |   ✓    |   ✓   |
| List **all** apps, incl. drafts   |   —    |   ✓    |   ✓   |
| Create / edit an app              |   —    |   ✓    |   ✓   |
| Publish or archive an app         |   —    |   ✓    |   ✓   |
| Create / edit a tag               |   —    |   ✓    |   ✓   |
| Assign an app to user groups      |   —    |   —    |   ✓   |
| See every app regardless of group |   —    |   —    |   ✓   |
| Trigger a group sync              |   —    |   —    |   ✓   |
| Read the audit log                |   —    |   —    |   ✓   |
| Soft-delete an app                |   —    |   —    |   ✓   |

Roles are cumulative: `admin` ⊃ `editor` ⊃ `viewer`. A user holding several
roles gets the highest.

Note the one row that is admin-only for a non-obvious reason: **assigning an app
to a group** changes who can see it. It is an access-control change wearing the
costume of a content edit, so it does not belong to `editor`.

This table is the test plan for the roles guard. One test per row that matters.

### 5.4 From a Keycloak claim to an apps-store role

The backend never reads a role name from a literal in code. It reads two
claims and applies a mapping from configuration.

```
AUTH_ROLE_CLAIM=realm_access.roles
AUTH_GROUP_CLAIM=groups
AUTH_ROLE_MAP=apps-store-admin:admin,apps-store-editor:editor
AUTH_DEFAULT_ROLE=viewer
```

Resolution, in order:

1. Read the values at `AUTH_ROLE_CLAIM`.
2. Map each through `AUTH_ROLE_MAP`; unmapped values are ignored, not an error.
3. If nothing mapped, fall back to `AUTH_DEFAULT_ROLE`.
4. Take the highest role that resulted.

**Why a map and not a hardcoded name.** Adopters whose IdP is not the bundled
Keycloak will send something else entirely — an Entra ID group object GUID, an
Okta group name with a space in it. `AUTH_ROLE_MAP` absorbs that. It is also
why the same mechanism accepts _group_ names on the left-hand side: a provider
that only emits groups and no roles still works, by mapping a group to a role.

`AUTH_DEFAULT_ROLE=viewer` means anyone who can authenticate against the realm
can browse the catalog. That is the right default for an internal tool — the
directory already decided who works here.

### 5.5 The visibility rule

Precisely, for a caller with group ids `G` and role `R`:

> An app is visible when it is not soft-deleted, **and** its status is
> `PUBLISHED`, **and** either it has no `app_user_groups` rows at all
> (company-wide) or at least one of them is in `G`. If `R` is `admin`, all
> non-deleted apps are visible regardless.

Expressed once, in the repository layer, and reused by every list and detail
read:

```sql
WHERE a.deleted_at IS NULL
  AND (:is_admin OR a.status = 'PUBLISHED')
  AND (:is_admin OR NOT EXISTS (
        SELECT 1 FROM app_user_groups aug WHERE aug.app_id = a.id
      )
      OR EXISTS (
        SELECT 1 FROM app_user_groups aug
        WHERE aug.app_id = a.id AND aug.user_group_id = ANY(:group_ids)
      ))
```

Two rules that follow, and are worth stating because breaking them is silent:

1. `GET /apps/:id` applies the same predicate. A hidden app must return `404`,
   not `403` — `403` confirms the app exists.
2. No endpoint takes the caller's groups from the request body or a query
   parameter. They come from the verified token, only.

## 6. Login and token flow

### 6.1 Keycloak setup

One realm, `apps-store`, exported to `infra/keycloak/realm-apps-store.json` and
committed so `docker compose up` gives a contributor a working login.

**Clients**

| Client                | Type         | Purpose                                   |
| --------------------- | ------------ | ----------------------------------------- |
| `apps-store-web`      | Confidential | The BFF. Authorization code + PKCE        |
| `apps-store-api`      | Bearer-only  | Not a login client; exists to be an `aud` |
| `apps-store-api-sync` | Service acct | Reads groups from the Keycloak Admin API  |

`apps-store-web` settings: standard flow **on**; implicit, direct-access and
password grants **off**; PKCE method `S256` required; redirect URI pinned
exactly to `http://localhost:3000/api/auth/callback` — exact match, never a
wildcard; post-logout redirect `http://localhost:3000/`.

`apps-store-api-sync` holds the realm-management role `view-groups` and nothing
else.

**Realm roles:** `apps-store-editor`, `apps-store-admin`. No role for viewer —
that is the absence of both.

**Groups:** `/finance`, `/engineering`, `/people-ops` as demo data.

**Mappers on `apps-store-web`:**

- _Group Membership_ → claim `groups`, full path **off** (so the claim reads
  `finance`, not `/finance`).
- _Audience_ → adds `apps-store-api` to the access token's `aud`.
- Default `profile` and `email` scopes supply `name` and `email`.

**Demo users** (seeded, documented in the README):

| User    | Groups      | Realm roles         |
| ------- | ----------- | ------------------- |
| `alice` | finance     | —                   |
| `bob`   | engineering | `apps-store-editor` |
| `carol` | people-ops  | `apps-store-admin`  |

Three users, three role levels, three different groups. Every access-control
test can be written against them.

### 6.2 The login sequence

```
 browser            webapp (BFF)          keycloak            backend
    │                    │                    │                  │
 1  ├── GET /auth/login ─▶                    │                  │
 2  │  ◀── 302 to /authorize (PKCE challenge, state, nonce)      │
 3  ├─────────── login form, password, MFA ──▶                   │
 4  │  ◀── 302 /auth/callback?code&state ─────┤                  │
 5  │                    ├── POST /token (code + secret + verifier)
 6  │                    │  ◀── access + id + refresh tokens ────┤
 7  │  ◀── Set-Cookie: session; 302 / ────────┤                  │
 8  ├── GET /api/apps (cookie) ──▶            │                  │
 9  │                    ├── GET /apps  Authorization: Bearer ──▶ │
10  │                    │                    ◀── JWKS (cached) ─┤
11  │  ◀───────────────── apps JSON ──────────────────────────────┤
```

Steps 5 and 6 are server-to-server: the code, the client secret and the tokens
never pass through the browser. Step 10 happens once per key-rotation period,
not once per request.

`state` is compared on return and the request is rejected if it does not match.
`nonce` is compared inside the ID token. Both are stored in a short-lived,
`HttpOnly` cookie set at step 2 and cleared at step 7.

### 6.3 Sessions, cookies and lifetimes

| Thing                  | Value        | Why                                    |
| ---------------------- | ------------ | -------------------------------------- |
| Access token           | 10 minutes   | Bounds how long a revoked user lingers |
| Refresh token          | 8 h idle     | One working day without re-login       |
| BFF session (Redis)    | 8 h, rolling | Matches the refresh token              |
| Login handshake cookie | 5 minutes    | Only needs to survive the redirect     |

The session cookie:

```
__Host-apps_store_session=<opaque id>
  HttpOnly; Secure; SameSite=Lax; Path=/
```

Opaque id only — the value is a Redis key, and carries no user data. `SameSite=Lax`
allows the return leg of the OAuth redirect; `Strict` would break it.
The `__Host-` prefix is dropped in local HTTP development, where `Secure`
cannot be set.

### 6.4 First login

The first time the backend sees an `idp_subject`, it creates the `users` row
from the token's claims — just-in-time provisioning. There is no invite flow, no
registration screen, and no admin step. If Keycloak says you exist, you exist.

On every subsequent login the row's `email`, `display_name` and `last_login_at`
are refreshed from the token, so a name change in the directory propagates.

Groups seen in a token are also upserted into `user_groups`, as a safety net
behind the sync job.

### 6.5 Logout

Two different things, and users conflate them:

- **App logout** (the default): delete the Redis session, clear the cookie.
  The user stays signed in to Keycloak, so clicking Sign in returns them
  immediately.
- **Full logout**: additionally redirect to the realm's `end_session_endpoint`.
  Offered as a distinct "Sign out everywhere" action.

### 6.6 Refresh

The BFF refreshes when the access token is inside 60 seconds of expiry, before
proxying the request — not after receiving a `401`. If the refresh fails, the
session is destroyed and the response is a `401` that the frontend turns into a
redirect to login.

Only one refresh runs at a time per session; concurrent requests wait on it.
Two parallel refreshes with rotating refresh tokens will invalidate each other,
and the symptom — random logouts under load — is miserable to debug later.

### 6.7 Verification in the backend

Every request to the backend is verified independently. Using `jose`:

1. `createRemoteJWKSet(new URL(jwks_uri))` at boot, from the discovery document.
   It caches keys and refetches on an unknown `kid`.
2. `jwtVerify` checking, in this order: signature, `iss` equals
   `AUTH_ISSUER_URL`, `aud` contains `apps-store-api`, `exp`/`nbf` with 60 s of
   clock tolerance.
3. Extract `sub`, `email`, `name`, the group claim and the role claim.
4. Resolve the role per [5.4](#54-from-a-keycloak-claim-to-an-apps-store-role),
   look up or create the user, and attach `{ id, sub, role, groupIds }` to the
   request.

The `aud` check is not optional. Without it, a token minted for any other client
in the same realm is a valid token for this API.

`jose` over `nest-keycloak-connect`: fewer layers, no Keycloak-specific
assumptions, and it keeps [2.1](#21-the-bundled-identity-provider-is-keycloak)'s
escape hatch honest.

### 6.8 Group sync

`user_groups` is refreshed by `GroupSyncService` in `backend`, using the
`apps-store-api-sync` service account against Keycloak's Admin API:

- on boot,
- hourly,
- on demand via `POST /admin/user-groups/sync`.

Groups that disappear from Keycloak are kept as rows but marked stale by an
unchanged `synced_at`; they are never hard-deleted, because `app_user_groups`
rows point at them.

**Why a service account and not only the login-time upsert.** An admin needs to
assign an app to `/finance` before anyone from Finance has ever logged in.
Login-time upsert alone leaves the picker empty on a fresh install.

### 6.9 Environment variables

```
# backend
DATABASE_URL=postgresql://appsstore:...@postgres:5432/appsstore
PORT=4000
WEBAPP_ORIGIN=http://localhost:3000   # CORS; drop when the BFF proxies
AUTH_ISSUER_URL=http://keycloak:8080/realms/apps-store
AUTH_API_AUDIENCE=apps-store-api
AUTH_ROLE_CLAIM=realm_access.roles
AUTH_GROUP_CLAIM=groups
AUTH_ROLE_MAP=apps-store-admin:admin,apps-store-editor:editor
AUTH_DEFAULT_ROLE=viewer
KEYCLOAK_ADMIN_BASE_URL=http://keycloak:8080
KEYCLOAK_SYNC_CLIENT_ID=apps-store-api-sync
KEYCLOAK_SYNC_CLIENT_SECRET=...

# webapp
AUTH_ISSUER_URL=http://keycloak:8080/realms/apps-store
AUTH_CLIENT_ID=apps-store-web
AUTH_CLIENT_SECRET=...
AUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
SESSION_SECRET=...
REDIS_URL=redis://redis:6379
API_BASE_URL=http://backend:4000/api/v1
```

No secret has a default value in code. The app refuses to boot if one is
missing, rather than starting in a quietly insecure state.

## 7. API design

### 7.1 Conventions

1. The Nest API is served under `/api/v1`. The version is in the path from day
   one; adding it later is the expensive kind of change.
2. The browser never calls the backend directly. It calls same-origin routes on
   `webapp`, which proxy 1:1 and attach the bearer token. Same-origin means no
   CORS configuration and no preflight.
3. JSON is `camelCase`. Timestamps are ISO 8601 in UTC (`2026-08-29T09:14:00Z`).
4. `PATCH` for partial updates of a resource. `PUT` only where the whole
   collection is replaced, which is exactly one endpoint. `POST` for creation
   and for actions that are not CRUD (`publish`, `sync`).
5. Ids in URLs are UUIDs. A malformed one is `400`, an unknown one `404`.
6. Reads are `200`, creates `201`, actions that return nothing `204`.

### 7.2 Endpoints

Auth routes live on `webapp`, not the backend, because they are about the
browser session:

| Method | Path                   | Purpose                           |
| ------ | ---------------------- | --------------------------------- |
| `GET`  | `/api/auth/login`      | Begin the handshake               |
| `GET`  | `/api/auth/callback`   | Finish it, set the session cookie |
| `POST` | `/api/auth/logout`     | App logout                        |
| `GET`  | `/api/auth/logout/all` | Full logout via `end_session`     |

The backend's endpoints. "Filtered" means [5.5](#55-the-visibility-rule)
applies.

| Method   | Path                          | Role   | Notes                         |
| -------- | ----------------------------- | ------ | ----------------------------- |
| `GET`    | `/health`                     | none   | Liveness. No auth, no DB read |
| `GET`    | `/me`                         | viewer | Identity, role, group ids     |
| `GET`    | `/apps`                       | viewer | Filtered. Paged               |
| `GET`    | `/apps/:id`                   | viewer | Filtered; hidden ⇒ `404`      |
| `PUT`    | `/apps/:id/favorite`          | viewer | Idempotent. `204`             |
| `DELETE` | `/apps/:id/favorite`          | viewer | Idempotent. `204`             |
| `GET`    | `/tags`                       | viewer | Active tags                   |
| `GET`    | `/user-groups`                | viewer | The mirror, read-only         |
| `GET`    | `/admin/apps`                 | editor | **Un**filtered, all statuses  |
| `POST`   | `/admin/apps`                 | editor | Creates as `DRAFT`            |
| `PATCH`  | `/admin/apps/:id`             | editor | Content fields only           |
| `POST`   | `/admin/apps/:id/publish`     | editor | `DRAFT` → `PUBLISHED`         |
| `POST`   | `/admin/apps/:id/archive`     | editor | → `ARCHIVED`                  |
| `DELETE` | `/admin/apps/:id`             | admin  | Soft delete. `204`            |
| `PUT`    | `/admin/apps/:id/user-groups` | admin  | Replaces the whole set        |
| `POST`   | `/admin/tags`                 | editor |                               |
| `PATCH`  | `/admin/tags/:id`             | editor |                               |
| `POST`   | `/admin/user-groups/sync`     | admin  | Runs the sync now             |
| `GET`    | `/admin/audit-log`            | admin  | Paged, filterable by entity   |

Two things this table encodes deliberately:

- **Visibility changes are a separate endpoint from content edits.** An editor
  can `PATCH` an app's description but cannot reach
  `PUT /admin/apps/:id/user-groups`. That is [5.3](#53-permission-matrix)'s
  admin-only row, enforced by the URL rather than by field-level checks inside
  one handler.
- **`/apps` and `/admin/apps` are different endpoints**, not one endpoint with
  a flag. The catalog list is filtered and the admin list is not; keeping them
  apart means the unfiltered query can never be reached by a viewer through a
  parameter.

### 7.3 Errors

One envelope, every failure, including validation:

```json
{
  "statusCode": 403,
  "code": "ROLE_REQUIRED",
  "message": "This action requires the editor role.",
  "details": null,
  "requestId": "01J9F2..."
}
```

- `code` is a stable machine-readable string; `message` is human-facing and may
  change. The frontend switches on `code`, never on `message`.
- `details` carries field errors on `400`: `[{ "field": "url", "rule": "isUrl" }]`.
- `requestId` is generated per request, logged, and returned. It is what a user
  quotes in a bug report.
- Implemented once as a Nest exception filter. No handler formats its own error.

Codes in use: `UNAUTHENTICATED` (401), `ROLE_REQUIRED` (403), `NOT_FOUND` (404),
`VALIDATION_FAILED` (400), `CONFLICT` (409), `INTERNAL` (500).

A hidden resource is `NOT_FOUND`, never `ROLE_REQUIRED` — see
[5.5](#55-the-visibility-rule).

### 7.4 Lists

Every list endpoint returns the same envelope, even when it is not paged:

```json
{
  "data": [],
  "meta": { "page": 1, "pageSize": 24, "total": 137 }
}
```

Query parameters: `page` (default 1), `pageSize` (default 24, max 100), `q`
(free-text search), and endpoint-specific filters such as `tagId` and
`userGroupId`.

**Why an envelope, given the frontend expects bare arrays today.** Because
`/apps` will need paging and `total`, and adding the envelope later means
touching every call site plus `http.ts`. There were three call sites, and it
was the ten-minute change it looked like — `getList` in `http.ts` unwraps
`data` for all three.

### 7.5 Representative payloads

`GET /me` — the endpoint the frontend uses to decide what to render:

```json
{
  "id": "6f1e...",
  "email": "carol@example.com",
  "displayName": "Carol Perera",
  "role": "admin",
  "groups": [{ "id": "9c2b...", "name": "People Ops" }]
}
```

`GET /apps` item — deliberately close to the current `App` type, with `status`
now an enum and `isFavorite` resolved per caller:

```json
{
  "id": "b7d3...",
  "name": "Expense Portal",
  "url": "https://expenses.internal",
  "version": "2.4.1",
  "tagline": "Submit and track expense claims",
  "description": "...",
  "status": "PUBLISHED",
  "icon": { "name": "expense", "sizeLabel": "48", "url": "/icons/expense.svg" },
  "tagIds": ["..."],
  "userGroupIds": ["..."],
  "isFavorite": true
}
```

`userGroupIds` is present on the admin list and omitted on `/apps` for
non-admins — a viewer has no reason to learn which other departments can see an
app.

### 7.6 What changes in `webapp`

The contract above is close to what the frontend already sends and receives.
The differences, all small and all better found now:

1. **Done.** `src/queries/http.ts` unwraps `data` from the list envelope in
   `getList`, and gained `patch`; `useUpdateApp` and `useUpdateTag` send
   `PATCH` with the changed fields rather than `PUT` with the whole object.
   `getList` still accepts a bare array, because Mockoon returns one and the
   mock stays runnable.
2. `BASE_URL` points at the same-origin proxy (`/api`), not `VITE_API_URL`, once
   auth is in — the browser must send the cookie, and the token must be attached
   server-side.
3. `App.status` becomes `'DRAFT' | 'PUBLISHED' | 'ARCHIVED'` instead of
   `boolean`. The admin toggle becomes a three-state control, or two buttons.
   Until then the column is the enum and `backend/src/apps/app.mapper.ts` maps
   it to a boolean at the edge — `PUBLISHED ⇄ true`, `DRAFT ⇄ false` — so the
   frontend needs no change to read or write. Both halves of that mapping go
   when this item is done.
4. `likedAppIds` leaves the Zustand store's client state and becomes server
   data: `isFavorite` on the app, mutated through the favourite endpoints. The
   `likedOnly` filter stays client-side, reading the new field.
5. The group filter in the store is now cosmetic — the server has already
   removed anything the user may not see.
6. A `useMeQuery` feeds a new `session` slice in the store; route guards and
   admin navigation read from it.

Everything else — the query-hook-writes-to-store pattern in
[state-management.md](./state-management.md) — is unchanged.

### 7.7 What is built today

`backend/` implements sections 3, 4 and 7 and none of 5 or 6. There is no
token, no guard and no group filter, deliberately: identity arrives in its own
phase, so a failure in this one is plumbing.

| Built                                                                | Waiting for auth                          |
| -------------------------------------------------------------------- | ----------------------------------------- |
| `GET /health`                                                        | `GET /me`                                 |
| `GET /apps`, `GET /apps/:id`                                         | the visibility predicate inside them      |
| `POST /apps`, `PATCH /apps/:id`                                      | their move to `/admin/apps` behind a role |
| `GET /tags`, `POST /tags`, `PATCH /tags/:id`                         | the same move, and the active-only filter |
| `GET /user-groups`                                                   | the sync job that fills it                |
| the §7.3 error envelope, the §7.4 list envelope, the whole §4 schema | favourites, audit writes, icon uploads    |

Two seams hold the shape of what is missing, and nothing else in the code
assumes a caller:

- `CurrentUserService.get()` resolves the caller. It returns the seeded dev
  user; [6.7](#67-verification-in-the-backend) replaces the body.
- `AppsRepository.visibleWhere()` narrows every read. It returns
  `deleted_at IS NULL`; [5.5](#55-the-visibility-rule) replaces the body.

While the browser calls the backend directly, the service allows CORS from
`WEBAPP_ORIGIN`. That goes when the BFF proxies same-origin, per
[2.3](#23-tokens-live-on-the-web-server-never-in-the-browser).

## 8. Known gaps

Deliberately deferred, recorded so they are decisions and not oversights.

1. **Group-scoped editors.** An editor can edit any app, not only their own
   group's. The model supports narrowing it later; the matrix does not need it
   yet.
2. **No SAML.** Bundled Keycloak speaks it upstream if an adopter needs it, so
   apps-store never has to.
3. **Revocation lag.** Disabling a user in Keycloak takes effect within one
   access-token lifetime (10 minutes), not instantly. Acceptable; the
   alternative is token introspection on every request.
4. **Single realm, single tenant.** No multi-tenancy. Out of scope.
5. **Audit log has no retention policy.** It grows forever. Fine until it isn't.

## Next

- Diagrams (container, ERD, login sequence) as Mermaid, added to this file.
- Then `backend/` scaffolding with sample endpoints and **no auth**, so that any
  failure at that stage is plumbing rather than identity.
