// Sidebar UI translations. Usage:
//   React:      const t = useT();  ...  {t.common.cancel}  {t.tabs.closeTabs(count)}
//   Non-React:  getMessages().actions.deletedSpace(name)
// Add every new key to ./en/<namespace>.ts AND ./zh-TW/<namespace>.ts.
import { useSyncExternalStore } from 'react';
import { i18n, getMessages } from './i18nStore';
import type { Messages } from './en';
import type { Locale, LanguageSetting } from './locale';

export { i18n, getMessages };
export type { Messages, Locale, LanguageSetting };
export { LOCALE_NATIVE_NAMES, SUPPORTED_LOCALES, resolveLocale } from './locale';

/** Messages in the current UI language; re-renders when the language changes */
export const useT = (): Messages => useSyncExternalStore(i18n.subscribe, i18n.getMessages);

/** Current UI language, e.g. for toLocaleDateString(locale) */
export const useLocale = (): Locale => useSyncExternalStore(i18n.subscribe, i18n.getLocale);

/** The user's language setting ('auto' or a fixed language) */
export const useLanguageSetting = (): LanguageSetting =>
  useSyncExternalStore(i18n.subscribe, i18n.getSetting);
