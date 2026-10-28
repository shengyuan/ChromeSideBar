# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome MV3 extension ("Side Bar for Arc Users") that shows Arc-style pinned sites, bookmarks, tabs and Spaces in Chrome's side panel. React 18 + TypeScript + Vite + Tailwind, `@dnd-kit` for drag & drop. Read `README.md` for the user-facing feature list.

This checkout is a personal fork (`origin` = `shengyuan/ChromeSideBar`) of `monemone-org/ChromeSideBar`, for personal use only. Nothing is contributed back upstream, so changes do not need to stay mergeable with upstream. The news check still points at upstream's GitHub Pages (`src/constants/urls.ts`, `NewsVersionChecker` in `src/background.ts`).

## Development Workflow

<Important>
1. **Always discuss first** - Before editing any file or executing any command, explain what you plan to do and get explicit approval. This applies in ALL modes, not just plan mode.
</Important>
2. **Minimize dependencies** - Avoid adding new npm packages unless necessary; prefer native browser APIs and existing libraries

## Build & Test

Do not run build after making changes. Notify the user to compile and verify.
Do not run `git add` or `git commit`. Notify the user to add and commit.

### Commands

```bash
npm install
npm run build          # tsc + vite build -> dist/ (production; DEV-only code stripped)
npm run build:debug    # vite --mode development -> dist/ with DEV menu items and test runner
npx tsc --noEmit       # type check only (strict, noUnusedLocals/Parameters)
npm run build:public-docs   # docs/news/news.md -> docs/public/news.html
```

- Load `dist/` via `chrome://extensions` → Developer mode → Load unpacked. `tools/start-test-chrome.sh` opens Chrome with an isolated profile (`tools/tmp/chrome-test-profile`, remote debugging on port 9333).
- `npm run lint` exists in `package.json`, but no ESLint config file is checked in.
- `vite.config.ts` has three entries: `index.html` (side panel), `navigator.html` (Space navigator popup), and `src/background.ts`, which must be emitted as root-level `background.js` because `manifest.json` references it by that name.

### Tests

There is no Node test runner; all tests run inside the extension and only exist in a debug build (`import.meta.env.DEV`).

- **Unit tests** (`src/tests/*Test.ts`): run from the sidebar's DEV menu items "Unit Test ..." (wired in `src/App.tsx`). Results are reported via toast.
- **In-panel test runner** (`src/tests/inpanel/`): `TestRunnerPanel` is lazily mounted in DEV. Cases live in `cases/section*.ts`, registered in `cases/index.ts`, and are ported from the manual cases in `docs/test/tab-space-association-test-cases.md`. To run a single case, uncheck the others in the panel (the selection persists in `chrome.storage.local`). Cases can pause for a manual step and resume after the sidebar reopens.
- Before writing an in-panel case, read `docs/test/writing-test-cases.md`. Key rules: assert against both the proxy mirror and background's copy, scope assertions to test-prefixed data (the suite runs on a real profile), restore destructive changes in `finally`, poll with a deadline instead of sleeping, and for cold-start cases stop the service worker rather than reloading the extension.

## Architecture

### Background managers and sidebar proxies

Shared state is owned by the service worker; the sidebar never writes those storage keys directly. Full design and rationale: `docs/decisions/2026-07-30-shared-storage-multiple-writers.md`.

- `src/managers/impl/` - manager classes instantiated in `background.ts` (`SpaceManager`, `SpaceWindowStateManager`, `TabHistoryManager`, `LastAudibleTracker`, `PinnedSitesManager`, `TabSpaceRegistry`). Each owns its storage key and implements `RoutedManager.dispatch`.
- `src/managers/shared/` - the `*Api` interface per manager plus its broadcast/message constants and shared types. It must not import React, because the service worker imports it.
- `src/managers/proxies/` - sidebar-side clients typed as `Remote<Api>`, so a change to one side without the other is a compile error. Mutations go through `callManager()` as messages `"<ManagerId>_msg_<method>"`. Reads are served synchronously from a local mirror (`src/stores/externalStore.ts`, read with `useSyncExternalStore`), because many reads happen during render.
- Each context stamps its `CONTEXT_ID` as `senderId`, and a proxy ignores broadcasts carrying its own id so a late echo cannot overwrite a newer optimistic write. A failed write re-reads state from background instead of rolling back.
- `background.ts` routes manager messages first, awaits `stateReady` (all managers loaded) before dispatch, and handles a few flat orchestration messages itself (`queue-tab-for-grouping`, `set-active-tab-and-space`).
- To add a manager: add an id to `ManagerId` in `messageRouting.ts`, write the Api in `shared/`, the impl, and the proxy, then `registerManager()` it in `background.ts`.
- Migration status: steps 1-5 are done. Step 6, `TabAssociationManager`, is not: tab associations (`tabAssociations_{windowId}` session + `tabAssociationsBackup_*` local) are still written by both `background.ts` and `src/contexts/BookmarkTabsContext.tsx` through `src/utils/tabAssociations.ts`. A `chrome.tabs.onDetached` listener in background is part of that work.

### Sidebar

- `src/App.tsx` composes the panel (pinned bar, bookmark tree, tab list, space bar, toolbar, dialogs). The largest components are `BookmarkTree.tsx` and `TabList.tsx`.
- `src/contexts/`: `SpacesContext` (the sidebar's `windowId`, Space list and active Space), `BookmarkTabsContext` (bookmark ↔ tab associations behind "Arc-style" live bookmarks), `UnifiedDndContext` (one dnd-kit context across pinned sites, bookmarks, tabs and groups; drag types in `src/types/dragDrop.ts`), `SelectionContext` (multi-select).
- A Space is a bookmark folder linked to a Chrome tab group by matching name; each window keeps its own active Space.
- `src/actions/`: undoable destructive operations (`UndoableAction` with `do`/`undo`) for closing tabs and deleting bookmarks, pinned sites and Spaces.
- `src/utils/searchParser.ts` implements the advanced search syntax; `PinnedBar`, `BookmarkTree` and `TabList` each filter with it.
- Every storage key, its area (session / local / `localStorage`) and its owner is listed in `docs/state-reference.md`; read it before adding state.

## Design Assumptions

- A bookmark folder belongs to at most one Space. Not enforced in the UI, but code that resolves a bookmark to its Space (e.g. tab/space association logic) assumes this and picks the first matching Space if a folder is somehow shared by more than one.

## Code Style

- Braces go on their own line (Allman style), matching the existing code.
- Before loops and sizable `if` blocks, add a short comment explaining what the loop/block is for
- Prefer classes with descriptive methods over raw data structures (Records, Maps, plain objects). If code skips a high-level concept and directly manipulates low-level primitives (e.g. `Object.entries(x).filter(...)`, `map.get(key)!.field`), wrap it in a class that expresses the intent
- Follow `docs/coding-guideline.md` for Chrome API pitfalls. Most important: always pass `windowId` to `chrome.tabs.create()` / `tabGroups.query()` and `createProperties.windowId` to `chrome.tabs.group()`. Otherwise Chrome acts on the focused window instead of the sidebar's window. Also keep service worker state in `chrome.storage.session`, since in-memory state is lost when the worker idles.
- Never hardcode the top-level bookmark folder ids `'1'` / `'2'` / `'3'` or their English titles. Since Chrome 134 they can be other ids (e.g. account bookmarks `'809'` / `'810'`, with no node `'2'`), and titles are localized (其他書籤). Use `src/utils/bookmarkRoots.ts` (`findRootFolder`, `requireRootFolder`, `isRootFolder`).

## Shared Utilities

### Chrome API Error Handling

Use `createChromeErrorHandler` from `src/utils/chromeError.ts` for handling Chrome API errors in hooks:

```typescript
import { createChromeErrorHandler } from '../utils/chromeError';

const [error, setError] = useState<string | null>(null);
const handleError = useCallback(
  createChromeErrorHandler('YourContext', setError),
  []
);
```

This provides consistent error logging and state management across all Chrome API calls.

### Local Storage

Use `chrome.storage.local` (via `useChromeLocalStorage` hook) for new persistent state. Legacy code uses `localStorage` (`useLocalStorage` hook) — don't migrate existing keys, but all new keys should use `chrome.storage.local` for consistency and cross-window sync. State shared with the background must go through its manager/proxy instead (see Architecture). Scope keys by `windowId` / `spaceId` when each window or Space needs its own value.

### debug log with console.log

Only enable logging in debug build:
```typescript
  if (import.meta.env.DEV)
  {
      console.log(...);
  }
```

## Documentation

- `docs/features/` - Feature specs. New ones use the `new-feature-doc` skill (`.claude/skills/`): ID from `docs/features/next-id.txt`, plus required frontmatter. Finished specs move to `docs/features/completed/`.
- `docs/decisions/` - design decision records
- `docs/state-reference.md` - Extension state reference
- `docs/test/` - manual test cases, results and open issues (`docs/test/issues/`)
- `docs/code-audit-check-guideline.md` - how to run a multi-area code audit (one agent per area, reports under `docs/test-reports/{date}/`)
- `docs/chrome-web-store-info.md` - Chrome Web Store listing (summary, description, key features, change logs)
- `docs/changelog.md` is the full changelog. `src/data/changelog.ts` feeds the in-app What's New dialog; versions without an entry upgrade silently. See `docs/docs-usage.md`.

## Versioning & Release

**Before running command git-commit-msg**, update extension version number with:

```bash
./tools/update-version.sh
```

The version is `{major}.{minor}.{build}`, where build is the count of source-code-only commits; the script updates both `package.json` and `public/manifest.json`. For a release, follow `tools/prepare-release-instructions.md`, then `tools/build-release.sh` (zip to `releases/`) and `tools/create-release-tag.sh` (`release-{version}` tag).
