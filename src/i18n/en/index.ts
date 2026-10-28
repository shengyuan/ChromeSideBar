// English UI text: the source of truth for every message key.
// Each namespace lives in its own file; zh-TW (and any future language) must mirror it exactly,
// which the `Messages` type enforces at compile time.
import { common } from './common';
import { settings } from './settings';
import { app } from './app';
import { tabs } from './tabs';
import { bookmarks } from './bookmarks';
import { pinned } from './pinned';
import { iconPicker } from './iconPicker';
import { spaces } from './spaces';
import { dialogs } from './dialogs';
import { importExport } from './importExport';
import { actions } from './actions';
import { notices } from './notices';

export const en = {
  common,
  settings,
  app,
  tabs,
  bookmarks,
  pinned,
  iconPicker,
  spaces,
  dialogs,
  importExport,
  actions,
  notices,
};

export type Messages = typeof en;
