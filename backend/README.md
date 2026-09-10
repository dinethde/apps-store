# backend

The apps-store API: NestJS, Prisma, PostgreSQL. It serves the endpoints
`webapp/src/queries/` calls, reading real data instead of the Mockoon mock.

`docs/architecture.md` is the specification — §3 the data model, §4 the schema,
§7 the API contract. If this code and that file disagree, the file wins.

## There is no authentication yet

This pass is deliberately auth-free, so that any failure in it is plumbing
rather than identity. Nothing is guarded, and every caller is the seeded dev
user. Two seams are shaped for the next phase and nothing else assumes a
caller:

- `src/common/current-user.service.ts` — the one place identity is resolved.
  Keycloak's token replaces the seeded user here (§6.7).
- `AppsRepository.visibleWhere()` — the one place a read is narrowed. §5.5's
  group predicate goes in that function and every read picks it up.

Not built, deliberately: the role guard, the group visibility filter, the
`/admin/*` split, favourites, icon uploads to object storage, the audit-log
write path, and the Keycloak group sync. Each is marked `TODO` where it lands.

## Running it

From the repository root, start the database:

```bash
cp .env.example .env          # once
docker compose up -d postgres
```

Then, from `backend/`:

```bash
cp .env.example .env          # once; DATABASE_URL must match the root .env
bun install
bun run migrate               # applies prisma/migrations to a fresh database
bun run seed                  # mirrors webapp/mock/apps-store.json; idempotent
bun run dev                   # http://localhost:4000
```

Point the webapp at it — from `webapp/`, with Mockoon **stopped**:

```bash
VITE_API_URL=http://localhost:4000/api/v1 bun run dev
```

`bun run mock` and this backend are alternatives, not partners: whichever
`VITE_API_URL` names is the one the app talks to.

## Scripts

| Command                  | Does                                        |
| ------------------------ | ------------------------------------------- |
| `bun run dev`            | Watch mode on :4000                         |
| `bun run build`          | Compile to `dist/`                          |
| `bun run start`          | Run the compiled server                     |
| `bun run migrate`        | `prisma migrate dev` — development          |
| `bun run migrate:deploy` | `prisma migrate deploy` — containers and CI |
| `bun run seed`           | Re-run the seed; safe to repeat             |
| `bun run generate`       | Regenerate the Prisma client                |
| `bun run lint`           | eslint                                      |
| `bun run format`         | prettier --write + eslint --fix             |

The database is never changed by hand — every change is a committed migration.

## Endpoints

Served under `/api/v1`, except `/health`.

| Method  | Path           | Notes                                    |
| ------- | -------------- | ---------------------------------------- |
| `GET`   | `/health`      | Liveness. No database read               |
| `GET`   | `/apps`        | Paged: `page`, `pageSize` (max 100), `q` |
| `GET`   | `/apps/:id`    | Unknown or hidden id ⇒ `404`             |
| `POST`  | `/apps`        | `201`                                    |
| `PATCH` | `/apps/:id`    | Partial; `tagIds`/`userGroupIds` replace |
| `GET`   | `/tags`        | Unpaged — the picker needs every tag     |
| `POST`  | `/tags`        | Duplicate name ⇒ `409`                   |
| `PATCH` | `/tags/:id`    |                                          |
| `GET`   | `/user-groups` | Read-only mirror of Keycloak's groups    |

Lists return `{ data, meta: { page, pageSize, total } }` (§7.4). Failures
return one envelope, shaped once in `AllExceptionsFilter` (§7.3):

```json
{
  "statusCode": 400,
  "code": "VALIDATION_FAILED",
  "message": "The request body failed validation.",
  "details": [{ "field": "url", "rule": "isUrl" }],
  "requestId": "b7316a41-23f3-485a-82de-db32effe2a1c"
}
```

`requestId` is also returned as the `x-request-id` header.

## Two shapes that differ from the spec, on purpose

1. **`status` is a boolean over the wire.** The column is the `AppStatus` enum
   from §4; the frontend's `App.status` is still a boolean, so `app.mapper.ts`
   maps `PUBLISHED ⇄ true` and `DRAFT ⇄ false` at the edge. Both halves go when
   the admin toggle becomes the three-state control of §7.6.3.
2. **`GET /tags` returns every tag, not only active ones.** The admin screens
   read the same list, and an inactive tag has to stay editable. The active-only
   filter belongs on the catalog list once `/admin/tags` exists.
