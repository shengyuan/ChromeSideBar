---
created: 2026-10-28
after-version: 1.0.352
status: completed
---

# 034 - UI Language Switch (English / 正體中文)

## Goal

Every user-visible text in the extension can be shown in English or 正體中文.
Settings → Appearance → Language offers:

- **Follow Chrome** (default): uses Chrome's UI language. Traditional Chinese
  variants (zh-TW, zh-HK, zh-MO, zh-Hant) get 正體中文; everything else gets English.
- **English**
- **正體中文**

Switching applies immediately to every open sidebar and the Space Navigator popup,
without reloading the extension.

## Scope

Translated:

- Everything visible in the sidebar: toolbar, section headers, menus and context menus,
  dialogs, toasts and undo messages, tooltips, empty states, the Space Navigator popup.
- The extension name, description, toolbar button title and keyboard shortcut descriptions
  shown by Chrome (`chrome://extensions`, `chrome://extensions/shortcuts`). These come from
  `public/_locales/` and always follow Chrome's UI language; the Settings choice cannot
  change them.

Not translated:

- What's New / changelog content (`src/data/changelog.ts`, `docs/news`), help pages.
- Names the user typed or that come from Chrome: bookmarks, Spaces, tab titles, group names.
- Text written into the user's data or used for matching, e.g. folder names the extension
  creates in Chrome bookmarks, storage values, search syntax keywords (`searchParser.ts`).
- Developer-only UI (`import.meta.env.DEV` blocks, the in-panel test runner, "Unit Test" menu
  items) and console logs.

## Design

No new dependency. `src/i18n/`:

- `locale.ts` - `Locale` (`'en' | 'zh-TW'`), `LanguageSetting` (`'auto' | Locale`),
  `resolveLocale()`. Pure, unit-testable.
- `en/<namespace>.ts` - English text, the source of truth. `en/index.ts` combines the
  namespaces and exports the `Messages` type.
- `zh-TW/<namespace>.ts` - each typed as `typeof en.<namespace>`, so a missing key, an extra key
  or a wrong function signature is a compile error.
- `i18nStore.ts` - current language for the page, kept in an `ExternalStore`. The setting is in
  `chrome.storage.local` (`sidebar-language`); `storage.onChanged` switches every page.
  `main.tsx` / `navigator.tsx` await `i18n.init()` before the first render to avoid a flash
  of the wrong language. It also sets `<html lang>`.
- `index.ts` - `useT()` (React), `getMessages()` (non-React), `useLocale()`,
  `useLanguageSetting()`.

### Message conventions

- A message is a string, or a function with typed parameters for interpolation and plurals:
  ```ts
  // en
  closeTabs: (count: number) => count === 1 ? 'Close Tab' : `Close ${count} Tabs`,
  // zh-TW
  closeTabs: (count) => `關閉 ${count} 個分頁`,
  ```
- Text with embedded markup: a function taking `React.ReactNode` parts (namespace file
  becomes `.tsx`).
- React components call `const t = useT()` and read `t.<namespace>.<key>`.
- Non-React code calls `getMessages()` when the text is needed. Never keep translated text in a
  module-level constant: it would freeze the language at load time.
- `common` holds generic words (Cancel, Save, Delete...). Feature text goes in its feature's
  namespace even if a similar word exists elsewhere, when the context differs.

## 正體中文 style guide

- Taiwan usage: 設定, 檔案, 資料夾, 視窗, 網址, 預設, 匯入/匯出, 重新整理, 拖曳.
- Full-width punctuation in Chinese text: ，。、：；！？（）「」. Ellipsis `…`.
- A half-width space between Chinese and Latin letters or digits: `3 個分頁`, `Arc 風格`.
- Quote user-provided names with 「」: `已刪除空間「工作」`.
- Short, natural phrasing for buttons and menu items; no translationese.
- Keep brand and feature names as is: Arc, Chrome, GitHub, Iconify, Top Apps.
- Keyboard keys stay as is: Cmd, Ctrl, Shift, Option, Alt.

### Glossary

| English | 正體中文 |
|---|---|
| Sidebar | 側邊欄 |
| Pinned site / Pin | 釘選網站 / 釘選 |
| Unpin | 取消釘選 |
| Bookmark | 書籤 |
| Folder | 資料夾 |
| Bookmarks Bar / Other Bookmarks / Mobile Bookmarks | 書籤列 / 其他書籤 / 行動裝置書籤 |
| Tab | 分頁 |
| Tab group / Group | 分頁群組 / 群組 |
| Ungroup / Ungrouped tabs | 取消群組 / 未分組的分頁 |
| Window / New Window | 視窗 / 新視窗 |
| New Tab | 新分頁 |
| Space / Spaces | 空間 |
| All (the all-tabs Space) | 全部 |
| Space Navigator | 空間導覽 |
| Arc style | Arc 風格 |
| Live tab (a bookmark's open tab) | 已開啟的分頁 |
| Navigated away / drifted (tab left the saved URL) | 已離開原網址 |
| Pinned URL / bookmarked URL | 釘選的網址 / 書籤網址 |
| Audio / playing tab | 播放聲音的分頁 |
| Mute / Unmute | 靜音 / 取消靜音 |
| Settings / Appearance / Behaviour | 設定 / 外觀 / 行為 |
| Import / Export / Backup / Restore | 匯入 / 匯出 / 備份 / 還原 |
| Replace / Merge | 取代 / 合併 |
| Undo | 復原 |
| Filter / Saved filters | 篩選 / 已儲存的篩選條件 |
| Sort / by name / by date | 排序 / 依名稱 / 依日期 |
| Expand / Collapse | 展開 / 收合 |
| Drag / Drop | 拖曳 / 放開 |
| Duplicate | 複製一份 |
| What's New | 新功能 |
| About | 關於 |
| Emoji | 表情符號 |
| Icon / Color | 圖示 / 顏色 |
