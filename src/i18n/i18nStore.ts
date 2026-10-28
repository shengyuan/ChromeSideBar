// Current UI language for this page (sidebar or Space Navigator popup).
// The setting lives in chrome.storage.local, so changing it in one window
// switches every open sidebar and the navigator popup at once.
import { ExternalStore } from '../stores/externalStore';
import { en, Messages } from './en';
import { zhTW } from './zh-TW';
import {
  Locale,
  LanguageSetting,
  LANGUAGE_SETTING_KEY,
  DEFAULT_LANGUAGE_SETTING,
  parseLanguageSetting,
  resolveLocale,
} from './locale';

const MESSAGES_BY_LOCALE: Record<Locale, Messages> = {
  'en': en,
  'zh-TW': zhTW,
};

interface I18nState
{
  setting: LanguageSetting;
  locale: Locale;
  messages: Messages;
}

const getChromeUiLanguage = (): string =>
{
  try
  {
    return chrome.i18n.getUILanguage();
  }
  catch
  {
    return navigator.language;
  }
};

const buildState = (setting: LanguageSetting): I18nState =>
{
  const locale = resolveLocale(setting, getChromeUiLanguage());
  return { setting, locale, messages: MESSAGES_BY_LOCALE[locale] };
};

class I18nStore
{
  #store = new ExternalStore<I18nState>(buildState(DEFAULT_LANGUAGE_SETTING));
  #loading: Promise<void> | undefined;

  // Arrow properties so they can be passed detached (e.g. into useSyncExternalStore)
  subscribe = (onChange: () => void): (() => void) => this.#store.subscribe(onChange);
  getMessages = (): Messages => this.#store.getSnapshot().messages;
  getLocale = (): Locale => this.#store.getSnapshot().locale;
  getSetting = (): LanguageSetting => this.#store.getSnapshot().setting;

  /**
   * Loads the saved setting and starts following changes from other windows.
   * Await it before the first render so the page never flashes the wrong language.
   */
  init(): Promise<void>
  {
    this.#loading ??= this.#load();
    return this.#loading;
  }

  /** Saves the user's choice; every open sidebar picks it up via storage.onChanged */
  async setLanguageSetting(setting: LanguageSetting): Promise<void>
  {
    this.#apply(setting);
    await chrome.storage.local.set({ [LANGUAGE_SETTING_KEY]: setting });
  }

  async #load(): Promise<void>
  {
    chrome.storage.onChanged.addListener((changes, areaName) =>
    {
      if (areaName !== 'local' || !(LANGUAGE_SETTING_KEY in changes))
      {
        return;
      }
      this.#apply(parseLanguageSetting(changes[LANGUAGE_SETTING_KEY].newValue));
    });

    try
    {
      const stored = await chrome.storage.local.get(LANGUAGE_SETTING_KEY);
      this.#apply(parseLanguageSetting(stored[LANGUAGE_SETTING_KEY]));
    }
    catch (error)
    {
      // Keep following Chrome's language if storage can't be read
      if (import.meta.env.DEV)
      {
        console.error('[i18n] Failed to load language setting:', error);
      }
    }
  }

  #apply(setting: LanguageSetting): void
  {
    const current = this.#store.getSnapshot();
    const next = buildState(setting);
    if (next.setting === current.setting && next.locale === current.locale)
    {
      document.documentElement.lang = current.locale;
      return;
    }
    this.#store.set(next);
    document.documentElement.lang = next.locale;
  }
}

export const i18n = new I18nStore();

/**
 * Current messages for code outside React (actions, utils, toasts).
 * Call it when the text is needed, never at module load, so a language switch is picked up.
 */
export const getMessages = (): Messages => i18n.getMessages();
