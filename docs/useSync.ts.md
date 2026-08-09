# File: `frontend/hooks/useSync.ts`

## Purpose

The **useSync** hook provides a React-friendly wrapper around the `syncService` module. It exposes functions to replicate local changes to Firestore (debounced) and orchestrate the login sync, automatically tracking the current user's ID.

## Key Features

- **User tracking** — keeps the current `user.uid` in a ref so callbacks don't need to re-create
- **Debounced replication** — `syncData()` replicates local changes to Firestore with debouncing when logged in
- **Guest mode** — when no user is logged in, `syncData()` is a no-op (localStorage only)
- **Login sync** — `syncOnLogin()` orchestrates the pull/push sync with Firestore
- **Flush support** — `flushSync()` flushes any pending debounced writes

## Key Functions

### `useSync()`

Returns an object with three functions:

```typescript
const { syncData, syncOnLogin, flushSync } = useSync();
```

### `syncData(data: SyncData): void`

Saves data to localStorage (via the caller's `saveCache`/`localStorage.setItem`) and replicates to Firestore with debouncing when a user is logged in.

> **IMPORTANT:** The caller is responsible for writing to localStorage first. This hook only handles the Firestore replication side.

- If a user is logged in → calls `syncToFirestore(uid, data)`
- If no user (guest mode) → no-op, localStorage is the only store

### `syncOnLogin(): Promise<'firestore' | 'local' | 'error'>`

Orchestrates the login sync:

- Pull Firestore data → overwrite local, or push local → Firestore
- Returns `'firestore'` | `'local'` | `'error'`
- Returns `'error'` if no user is logged in

### `flushSync(): Promise<void>`

Flushes any pending debounced writes to Firestore. Call on logout/user switch.

## Internal State

```typescript
const userIdRef = useRef<string | null>(null);
```

Keeps the latest `user.uid` in a ref so callbacks don't need to re-create on every render.

## Data Flow

1. Component calls `useSync()` → hook reads `user` from `useAuth()`
2. `userIdRef` is updated whenever `user` changes
3. When data changes locally, caller calls `syncData(data)`
4. If logged in → `syncToFirestore(uid, data)` debounces and replicates to Firestore
5. On login → caller calls `syncOnLogin()` to orchestrate pull/push
6. On logout → caller calls `flushSync()` to flush pending writes
