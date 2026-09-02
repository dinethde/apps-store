# State management

Two libraries, one direction of flow.

- **TanStack Query** owns the server: fetching, caching, refetching, mutations.
- **Zustand** owns what the UI reads: the fetched data plus client-only state
  (filters, likes).

```
component calls useAppsQuery() ──▶ query fetches ──▶ setApps() ──▶ component renders from the store
        ▲                                                                   │
        └──────── mutation invalidates the key ◀────────────────────────────┘
```

A component calls the query hook for the data it needs, and reads the values
back out of the store. React Query dedupes, so several components can call the
same hook without extra requests.

## The files

| File                        | Job                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `mock/apps-store.json`      | Mockoon environment: the local API.                                                       |
| `src/queries/http.ts`       | `getList` / `post` / `patch` against `VITE_API_URL` (default `http://localhost:3001`).    |
| `src/queries/apps.ts`       | `useAppsQuery`, `useCreateApp`, `useUpdateApp`.                                           |
| `src/queries/tags.ts`       | `useTagsQuery`, `useCreateTag`, `useUpdateTag`.                                           |
| `src/queries/userGroups.ts` | `useUserGroupsQuery` (read-only).                                                         |
| `src/store/appStore.ts`     | `useAppStore` — server data + `setApps` / `setTags` / `setUserGroups`, plus client state. |

## Reading data

```tsx
useAppsQuery(); // fetch + setApps
useTagsQuery(); // fetch + setTags

const apps = useAppStore((state) => state.apps);
const tags = useAppStore((state) => state.tags);
```

The query hooks return the full React Query result, so a component that wants a
loading state can take it: `const { isPending } = useAppsQuery()`.

## Changing data

```tsx
const createApp = useCreateApp();
await createApp.mutateAsync(values);
```

The hook invalidates `['apps']`, React Query refetches, the refetch calls
`setApps`, and every component reading `apps` re-renders. No component patches
the store by hand.

## Two servers to point at

`VITE_API_URL` decides which API the app talks to, and they are alternatives:

```bash
bun run mock   # Mockoon on :3001 — the default
# or, from backend/ — see backend/README.md
VITE_API_URL=http://localhost:4000/api/v1 bun run dev
```

The real backend wraps every collection in `{ data, meta }` (architecture §7.4)
and Mockoon answers with a bare array, so `getList` accepts both and hands the
hooks an array either way. Writes are `POST` and `PATCH`; Mockoon's CRUD routes
understand both, so the admin screens work against either server.

## The mock server

`mock/apps-store.json` is a [Mockoon](https://mockoon.com) environment with
three CRUD routes backed by data buckets: `/apps`, `/tags`, `/user-groups`.
CRUD routes give real behaviour — `POST /apps` appends and generates an `id`,
`PUT /apps/:id` replaces that item — so writes persist for as long as the
server is running, including across browser reloads. Restarting it resets the
data to the seed values in the file.

```bash
bun run mock   # http://localhost:3001
bun run dev    # http://localhost:3000
```

Both need to be running. Open `mock/apps-store.json` in the Mockoon desktop app
to edit routes or seed data by hand.

## Rules

1. Server data is written by the query hooks only. Anything else you write
   there is overwritten by the next refetch.
2. A mutation's job ends at `invalidateQueries`. Don't also update the store.
3. Adding a collection means: a CRUD route + data bucket in the Mockoon file, a
   query hook in `src/queries/`, and a field + setter in the store.
