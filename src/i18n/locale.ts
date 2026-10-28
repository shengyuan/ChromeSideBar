// Languages the sidebar UI can be shown in, and how the user's setting maps to one.
// Pure module (no chrome.* calls) so it can be unit tested outside the extension.

export type Locale = 'en' | 'zh-TW';

/** The user's choice in Settings: a fixed language, or follow Chrome's UI language */
export type LanguageSetting = 'auto' | Locale;

/** chrome.storage.local key holding the LanguageSetting (raw string) */
export const LANGUAGE_SETTING_KEY = 'sidebar-language';

export const DEFAULT_LANGUAGE_SETTING: LanguageSetting = 'auto';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'zh-TW'];

/** Each language's name in its own language, shown as-is in the language picker */
export const LOCALE_NATIVE_NAMES: Record<Locale, string> = {
  'en': 'English',
  'zh-TW': '正體中文',
};

export const parseLanguageSetting = (value: unknown): LanguageSetting =>
{
  if (value === 'auto' || SUPPORTED_LOCALES.includes(value as Locale))
  {
    return value as LanguageSetting;
  }
  return DEFAULT_LANGUAGE_SETTING;
};

/**
 * Picks the UI language. 'auto' follows Chrome's UI language: Traditional Chinese variants
 * (zh-TW, zh-HK, zh-MO, zh-Hant) get 正體中文, everything else falls back to English.
 */
export const resolveLocale = (setting: LanguageSetting, uiLanguage: string): Locale =>
{
  if (setting !== 'auto')
  {
    return setting;
  }

  const tag = uiLanguage.toLowerCase().replace('_', '-');
  if (/^zh-(tw|hk|mo|hant)\b/.test(tag))
  {
    return 'zh-TW';
  }
  return 'en';
};
