// Backup import/export, export folder conflict and Arc import dialogs; see docs/features/completed/034-i18n-language-switch.md
import type { ReactNode } from 'react';

export const importExport = {
  // Shared by the backup and Arc import dialogs
  importing: 'Importing...',
  importComplete: 'Import Complete',
  importFailed: 'Import failed. Please try again.',
  successfullyImported: 'Successfully imported:',
  showDetails: 'Show details',
  appendToExisting: 'Append to existing',
  replaceExisting: 'Replace existing',
  replaceAllSpaces: 'Replace all spaces',

  // Imported / found item counts
  pinnedSitesCount: (count: number) => `${count} pinned sites`,
  bookmarksCount: (count: number) => `${count} bookmarks`,
  tabsAndGroupsCount: (count: number) => `${count} tabs and groups`,
  spacesCount: (count: number) => `${count} spaces`,

  // Data type checkboxes (backup export and import)
  pinnedSitesWithCount: (count: number) => `Pinned sites (${count})`,
  bookmarks: 'Bookmarks',
  tabsAndGroups: 'Tabs and groups',
  tabsAndGroupsWithCount: (count: number) => `Tabs and groups (${count})`,
  spacesWithCount: (count: number) => `Spaces (${count})`,

  backupExport: {
    exporting: 'Exporting...',
    failed: 'Export failed. Please try again.',
  },

  backupImport: {
    title: 'Import Backup',
    fileTooLarge: 'Backup file too large (max 10MB)',
    invalidFormat: 'Invalid backup file format',
    noData: 'Backup file contains no data',
    parseFailed: 'Failed to parse backup file',
    exportedOn: (date: string) => `Exported: ${date}`,
    selectData: 'Select data to import:',
    replaceExistingPinnedSites: 'Replace existing pinned sites',
    replaceAllTabs: 'Replace all tabs',
    replaceAllBookmarks: 'Replace all bookmarks',
    importToOtherBookmarks: 'Import to Other Bookmarks',
    importToOtherBookmarksHint: 'Creates a subfolder with imported bookmarks',
  },

  exportConflict: {
    title: 'Folder Already Exists',
    message: (folderName: string) => `A bookmark folder named "${folderName}" already exists. What would you like to do?`,
    overwrite: 'Overwrite (replace all bookmarks)',
    merge: 'Merge (add missing bookmarks only)',
  },

  arcImport: {
    title: 'Import from Arc Browser',
    intro: 'Import your Arc Browser sidebar into Chrome, including top apps, spaces, and bookmarks.',
    // fileName is the rendered "StorableSidebar.json" element
    selectFileFrom: (fileName: ReactNode): ReactNode => <>Select Arc's {fileName} file from:</>,
    copyPath: 'Copy path',
    pathTip: 'Tip: use Cmd+Shift+G in the file picker to go to a path',
    selectFile: 'Select File...',
    fileTooLarge: 'File too large (max 10MB)',
    invalidFile: 'Not a valid Arc StorableSidebar.json file',
    noData: 'No importable data found in file',
    parseFailed: 'Failed to parse Arc sidebar file',

    // Preview summary
    found: 'Found:',
    foundTopApps: (count: number) => `${count} Top Apps`,
    foundSpaces: (count: number) => `${count} Spaces`,
    foundPinnedItems: (count: number) => `${count} pinned tabs/folders`,
    foundUnpinnedTabs: (count: number) => `${count} unpinned tabs`,
    foundSkipped: (count: number) => `${count} skipped (live folders)`,

    // Import options
    topAppsAsPinnedSites: 'Top Apps as Pinned Sites',
    spacesAndBookmarks: 'Spaces + Bookmarks',
    openUnpinnedTabs: 'Open unpinned tabs in Chrome',
    openUnpinnedTabsHint: 'Creates tab groups named after each space',

    // Result
    mergedWithExisting: (count: number) => ` (${count} merged with existing)`,
    tabsOpened: (count: number) => `${count} tabs opened`,
  },
};
