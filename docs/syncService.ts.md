# File: `frontend/utils/syncService.ts`

## Purpose

The **syncService** module provides centralized data synchronization between localStorage and Firebase Firestore. It handles guest mode (localStorage only), login sync (pull/push), debounced replication of local changes to Firestore, and graceful fallback to localStorage when Firestore is unreachable.

## Key Features

- **Guest mode** — no Firestore calls; all data read/written to localStorage only
- **Login sync** — on login, pulls Firestore data (overwrites local) or pushes local data to Firestore
- **Debounced writes** — local changes are replicated to Firestore after 800ms of inactivity
- **Timeout handling** — all Firestore operations have a 10s timeout guard
- **Graceful fallback** — Firestore errors are logged and swallowed; app continues on localStorage
- **Flush on logout** — pending debounced writes are flushed immediately on logout/user switch

## Constants

| Constant               | Value            | Description                                                 |
| ---------------------- | ---------------- | ----------------------------------------------------------- |
| `SYNC_KEYS`            | Array of 11 keys | All user-preference keys synced between local and Firestore |
| `DEFAULT_DEBOUNCE_MS`  | `800`            | Debounce delay for Firestore writes                         |
| `FIRESTORE_TIMEOUT_MS` | `10000`          | Timeout for Firestore operations                            |

## SyncData Interface

```typescript
interface SyncData {
  favoriteTeams?: string[];
  leaguesSelected?: string[];
  showScores?: boolean;
  showPreviousScores?: boolean;
  gameSelected?: unknown[];
  teamsSelected?: string[];
  teamsSelectedLeagues?: Record<string, string>;
  startDate?: string | null;
  endDate?: string | null;
  teamSelected?: string | null;
  leagueSelected?: string | null;
}
```

## Module-Level State

```typescript
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let pendingData: SyncData | null = null;
let pendingUserId: string | null = null;
```

Declared at module level so debounce state survives component unmounts.

## Key Functions

### `executeFirestoreWithTimeout(operation, activity, timeoutMs?)`

Wraps a Firestore operation with a timeout guard using `Promise.race`. Throws if the operation exceeds `timeoutMs`.

### `readLocalData(): SyncData`

Reads all user-preference data from localStorage/cache. Used for guest mode and pushing local data to Firestore on login.

### `applyFirestoreDataToLocal(data: SyncData): void`

Overwrites localStorage with Firestore data. Used when Firestore has data and takes priority over local cache.

### `hasFirestoreData(data: SyncData): boolean`

Determines whether a Firestore document contains meaningful user data. An empty document (only `lastLogin`/profile fields) is treated as "no data".

### `fetchUserDataFromFirestore(userId): Promise<SyncData | null>`

Fetches a user's document from Firestore with a timeout guard. Throws on network errors/timeouts so callers can fall back to local data.

### `pushLocalDataToFirestore(userId): Promise<void>`

Writes the current localStorage data to the user's Firestore document. Used when the user has no existing Firestore data (first login/registration).

### `syncOnLogin(userId): Promise<'firestore' | 'local' | 'error'>`

Orchestrates the login sync:

1. Try to fetch Firestore data
2. If data exists → overwrite localStorage with it, return `'firestore'`
3. If no data → push localStorage to Firestore, return `'local'`
4. If Firestore errors → fall back to localStorage (no-op), return `'error'`

### `syncToFirestore(userId, data): void`

Debounced replication of local changes to Firestore. Multiple rapid writes are merged into a single Firestore call after `DEFAULT_DEBOUNCE_MS` of inactivity. Errors are logged and swallowed so the app continues operating on local storage.

### `flushSync(): Promise<void>`

Immediately flushes any pending debounced write to Firestore. Call this on logout/user switch to avoid losing pending changes.

## Data Flow

### Guest Mode (Unauthenticated)

1. User is not logged in → `syncToFirestore` is never called (no userId)
2. All data read/written to localStorage via `saveCache`/`getCache`
3. No Firestore calls made

### Login Sync

1. User logs in → `syncOnLogin(userId)` is called
2. Fetch Firestore document with 10s timeout
3. **Firestore has data** → `applyFirestoreDataToLocal()` overwrites localStorage, app state updates
4. **No Firestore data** → `pushLocalDataToFirestore()` writes localStorage to Firestore
5. **Firestore error** → returns `'error'`, localStorage remains the source of truth

### Authenticated Writes

1. User modifies data → `saveCache()` writes to localStorage
2. `syncToFirestore(userId, data)` is called
3. Data is merged with any pending data
4. After 800ms of inactivity, a single Firestore `setDoc` call is made
5. If the write fails → error is logged, localStorage remains the source of truth

### Logout / User Switch

1. `flushSync()` is called
2. Any pending debounced write is immediately sent to Firestore
3. `signOut()` proceeds
