import { useState, useEffect, useRef } from 'react';
import { Dialog } from './Dialog';
import { FollowActiveTabMode } from '../utils/followActiveTab';
import { useT, LanguageSetting, LOCALE_NATIVE_NAMES, SUPPORTED_LOCALES, resolveLocale } from '../i18n';

export type BookmarkOpenMode = 'arc' | 'newTab' | 'activeTab';
export type TabGroupDisplayOrder = 'groupsFirst' | 'groupsLast' | 'chromeOrder';

export interface SettingsValues {
  fontSize: number;
  hideOtherBookmarks: boolean;
  tabGroupDisplayOrder: TabGroupDisplayOrder;
  pinnedIconSize: number;
  bookmarkOpenMode: BookmarkOpenMode;
  useSpaces: boolean;
  arcSingleClickOpensTab: boolean;
  arcShowTabTitleWhenDrifted: boolean;
  audioQuickJump: boolean;
  useSpaceColor: boolean;
  spaceColorAlpha: number;  // 1-100 percent
  followActiveTab: FollowActiveTabMode;
  language: LanguageSetting;
}

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsValues;
  onApply: (settings: SettingsValues) => void;
}

type SettingsTab = 'appearance' | 'behaviour' | 'debug';

export function SettingsDialog({
  isOpen,
  onClose,
  settings,
  onApply,
}: SettingsDialogProps) {
  const t = useT();
  // Temporary state for the dialog
  const [tempFontSize, setTempFontSize] = useState(settings.fontSize);
  const [tempHideOtherBookmarks, setTempHideOtherBookmarks] = useState(settings.hideOtherBookmarks);
  const [tempTabGroupDisplayOrder, setTempTabGroupDisplayOrder] = useState(settings.tabGroupDisplayOrder);
  const [tempPinnedIconSize, setTempPinnedIconSize] = useState(settings.pinnedIconSize);
  const [tempBookmarkOpenMode, setTempBookmarkOpenMode] = useState(settings.bookmarkOpenMode);
  const [tempUseSpaces, setTempUseSpaces] = useState(settings.useSpaces);
  const [tempArcSingleClickOpensTab, setTempArcSingleClickOpensTab] = useState(settings.arcSingleClickOpensTab);
  const [tempArcShowTabTitleWhenDrifted, setTempArcShowTabTitleWhenDrifted] = useState(settings.arcShowTabTitleWhenDrifted);
  const [tempAudioQuickJump, setTempAudioQuickJump] = useState(settings.audioQuickJump);
  const [tempUseSpaceColor, setTempUseSpaceColor] = useState(settings.useSpaceColor);
  const [tempSpaceColorAlpha, setTempSpaceColorAlpha] = useState(settings.spaceColorAlpha);
  const [tempFollowActiveTab, setTempFollowActiveTab] = useState(settings.followActiveTab);
  const [tempLanguage, setTempLanguage] = useState(settings.language);
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  // Track previous isOpen to detect when dialog opens
  const wasOpen = useRef(false);

  // Sync temp state when dialog opens (not on every settings change)
  // Read fresh values from localStorage for visual preferences (may be stale in parent state
  // if changed in another window). Chrome storage settings are always up-to-date via listener.
  useEffect(() => {
    // Only run when dialog opens, not when settings change while open
    if (isOpen && !wasOpen.current) {
      // Read fresh from localStorage for visual preferences
      const storedFontSize = localStorage.getItem('sidebar-font-size-px');
      const storedPinnedIconSize = localStorage.getItem('sidebar-pinned-icon-size-px');
      setTempFontSize(storedFontSize ? parseInt(storedFontSize, 10) : settings.fontSize);
      setTempPinnedIconSize(storedPinnedIconSize ? parseInt(storedPinnedIconSize, 10) : settings.pinnedIconSize);
      const storedTabGroupDisplayOrder = localStorage.getItem('sidebar-tab-group-display-order');
      setTempTabGroupDisplayOrder((storedTabGroupDisplayOrder as TabGroupDisplayOrder) || settings.tabGroupDisplayOrder);

      // These don't need fresh read - not shown in dialog or use chrome.storage.local
      setTempHideOtherBookmarks(settings.hideOtherBookmarks);
      setTempBookmarkOpenMode(settings.bookmarkOpenMode);
      setTempUseSpaces(settings.useSpaces);
      setTempArcSingleClickOpensTab(settings.arcSingleClickOpensTab);
      setTempArcShowTabTitleWhenDrifted(settings.arcShowTabTitleWhenDrifted);
      setTempAudioQuickJump(settings.audioQuickJump);
      setTempUseSpaceColor(settings.useSpaceColor);
      setTempSpaceColorAlpha(settings.spaceColorAlpha);
      setTempFollowActiveTab(settings.followActiveTab);
      setTempLanguage(settings.language);
      setActiveTab('appearance');
    }
    wasOpen.current = isOpen;
  }, [isOpen, settings]);

  const handleApply = () => {
    onApply({
      fontSize: tempFontSize,
      hideOtherBookmarks: tempHideOtherBookmarks,
      tabGroupDisplayOrder: tempTabGroupDisplayOrder,
      pinnedIconSize: tempPinnedIconSize,
      bookmarkOpenMode: tempBookmarkOpenMode,
      useSpaces: tempUseSpaces,
      arcSingleClickOpensTab: tempArcSingleClickOpensTab,
      arcShowTabTitleWhenDrifted: tempArcShowTabTitleWhenDrifted,
      audioQuickJump: tempAudioQuickJump,
      useSpaceColor: tempUseSpaceColor,
      spaceColorAlpha: tempSpaceColorAlpha,
      followActiveTab: tempFollowActiveTab,
      language: tempLanguage,
    });
  };

  const handleTempFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize > 4 && newSize < 72) {
      setTempFontSize(newSize);
    }
  };

  const handleTempPinnedIconSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize) && newSize >= 12 && newSize <= 48) {
      setTempPinnedIconSize(newSize);
    }
  };

  const tabClass = (tab: SettingsTab) =>
    `flex-1 px-3 py-2 text-sm font-medium transition-colors ${
      activeTab === tab
        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
    }`;

  const footerButtons = (
    <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-end gap-2">
      <button
        onClick={onClose}
        className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
      >
        {t.common.cancel}
      </button>
      <button
        onClick={handleApply}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {t.common.apply}
      </button>
    </div>
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.settings.title} maxWidth="max-w-xs" footer={footerButtons}>
      {/* Tab bar - sticky so it doesn't scroll away */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 flex border-b border-gray-200 dark:border-gray-700 z-10">
        <button onClick={() => setActiveTab('appearance')} className={tabClass('appearance')}>
          {t.settings.tabAppearance}
        </button>
        <button onClick={() => setActiveTab('behaviour')} className={tabClass('behaviour')}>
          {t.settings.tabBehaviour}
        </button>
        {import.meta.env.DEV && (
          <button onClick={() => setActiveTab('debug')} className={tabClass('debug')}>
            Debug
          </button>
        )}
      </div>

      <div className="p-3 space-y-3">
        {activeTab === 'appearance' && (
          <>
            {/* Language */}
            <div>
              <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t.settings.language}
              </label>
              <select
                value={tempLanguage}
                onChange={(e) => setTempLanguage(e.target.value as LanguageSetting)}
                className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="auto">
                  {t.settings.languageFollowChrome(LOCALE_NATIVE_NAMES[resolveLocale('auto', chrome.i18n.getUILanguage())])}
                </option>
                {/* Each language is listed by its own name, whatever the current UI language */}
                {SUPPORTED_LOCALES.map(locale => (
                  <option key={locale} value={locale}>{LOCALE_NATIVE_NAMES[locale]}</option>
                ))}
              </select>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {t.settings.languageHint}
              </p>
            </div>

            {/* Font Size */}
            <div>
              <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t.settings.fontSize}
              </label>
              <input
                type="number"
                min="6"
                max="36"
                value={tempFontSize}
                onChange={handleTempFontSizeChange}
                className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {t.settings.defaultSize(14)}
              </p>
            </div>

            {/* Pinned Icon Size */}
            <div>
              <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t.settings.pinnedIconSize}
              </label>
              <input
                type="number"
                min="12"
                max="48"
                value={tempPinnedIconSize}
                onChange={handleTempPinnedIconSizeChange}
                className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {t.settings.defaultSize(22)}
              </p>
            </div>

            {/* Use space colour as sidebar background */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempUseSpaceColor}
                  onChange={(e) => setTempUseSpaceColor(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                {t.settings.useSpaceColor}
              </label>
              <p className="mt-0.5 text-gray-500 dark:text-gray-400 ml-5">
                {tempUseSpaceColor
                  ? t.settings.useSpaceColorOnHint
                  : t.settings.useSpaceColorOffHint}
              </p>
              {tempUseSpaceColor && (
                <div className="ml-5 mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-gray-700 dark:text-gray-300">
                      {t.settings.spaceColorIntensity}
                    </label>
                    <span className="text-gray-500 dark:text-gray-400">
                      {tempSpaceColorAlpha}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={tempSpaceColorAlpha}
                    onChange={(e) => setTempSpaceColorAlpha(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-500"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'behaviour' && (
          <>
            {/* Open bookmark mode */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                {t.settings.openBookmark}
              </label>
              <select
                value={tempBookmarkOpenMode}
                onChange={(e) => setTempBookmarkOpenMode(e.target.value as BookmarkOpenMode)}
                className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="arc">{t.settings.openBookmarkArc}</option>
                <option value="newTab">{t.settings.openBookmarkNewTab}</option>
                <option value="activeTab">{t.settings.openBookmarkActiveTab}</option>
              </select>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {tempBookmarkOpenMode === 'arc' && t.settings.openBookmarkArcHint}
                {tempBookmarkOpenMode === 'newTab' && t.settings.openBookmarkNewTabHint}
                {tempBookmarkOpenMode === 'activeTab' && t.settings.openBookmarkActiveTabHint}
              </p>
            </div>

            {/* Single click (Arc mode only) */}
            {tempBookmarkOpenMode === 'arc' && (
              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempArcSingleClickOpensTab}
                    onChange={(e) => setTempArcSingleClickOpensTab(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  {t.settings.singleClickOpensTab}
                </label>
                <p className="mt-0.5 text-gray-500 dark:text-gray-400 ml-5">
                  {tempArcSingleClickOpensTab
                    ? t.settings.singleClickOpensTabOnHint
                    : t.settings.singleClickOpensTabOffHint}
                </p>
              </div>
            )}

            {/* Bookmark title after navigating away (Arc mode only) */}
            {tempBookmarkOpenMode === 'arc' && (
              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempArcShowTabTitleWhenDrifted}
                    onChange={(e) => setTempArcShowTabTitleWhenDrifted(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  {t.settings.showTabTitleWhenDrifted}
                </label>
                <p className="mt-0.5 text-gray-500 dark:text-gray-400 ml-5">
                  {tempArcShowTabTitleWhenDrifted
                    ? t.settings.showTabTitleWhenDriftedOnHint
                    : t.settings.showTabTitleWhenDriftedOffHint}
                </p>
              </div>
            )}

            {/* Show Spaces */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempUseSpaces}
                  onChange={(e) => setTempUseSpaces(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                {t.settings.showSpaces}
              </label>
              <p className="mt-0.5 text-gray-500 dark:text-gray-400 ml-5">
                {tempUseSpaces
                  ? t.settings.showSpacesOnHint
                  : t.settings.showSpacesOffHint}
              </p>
            </div>

            {/* Audio button */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tempAudioQuickJump}
                  onChange={(e) => setTempAudioQuickJump(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                {t.settings.audioQuickJump}
              </label>
              <p className="mt-0.5 text-gray-500 dark:text-gray-400 ml-5">
                {tempAudioQuickJump
                  ? t.settings.audioQuickJumpOnHint
                  : t.settings.audioQuickJumpOffHint}
              </p>
            </div>

            {/* Follow active tab */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                {t.settings.followActiveTab}
              </label>
              <select
                value={tempFollowActiveTab}
                onChange={(e) => setTempFollowActiveTab(e.target.value as FollowActiveTabMode)}
                className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="space-and-scroll">{t.settings.followActiveTabSpaceAndScroll}</option>
                <option value="space">{t.settings.followActiveTabSpace}</option>
                <option value="off">{t.common.off}</option>
              </select>
              <p className="mt-0.5 text-gray-500 dark:text-gray-400 ml-5">
                {tempFollowActiveTab === 'space-and-scroll' &&
                  t.settings.followActiveTabSpaceAndScrollHint}
                {tempFollowActiveTab === 'space' &&
                  t.settings.followActiveTabSpaceHint}
                {tempFollowActiveTab === 'off' &&
                  t.settings.followActiveTabOffHint}
              </p>
            </div>

            {/* Tab group display order */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                {t.settings.tabGroupDisplayOrder}
              </label>
              <select
                value={tempTabGroupDisplayOrder}
                onChange={(e) => setTempTabGroupDisplayOrder(e.target.value as TabGroupDisplayOrder)}
                className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="groupsFirst">{t.settings.tabGroupOrderGroupsFirst}</option>
                <option value="groupsLast">{t.settings.tabGroupOrderGroupsLast}</option>
                <option value="chromeOrder">{t.settings.tabGroupOrderChrome}</option>
              </select>
              <p className="mt-0.5 text-gray-500 dark:text-gray-400 ml-5">
                {t.settings.tabGroupDisplayOrderHint}
              </p>
            </div>
          </>
        )}

        {import.meta.env.DEV && activeTab === 'debug' && (
          <>
            {/* Reset Welcome */}
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300">
                Reset Welcome
              </label>
              <button
                onClick={() =>
                {
                  localStorage.removeItem('sidebar-has-seen-welcome');
                  alert('Welcome dialog reset. Reload extension to see it.');
                }}
                className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800"
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
