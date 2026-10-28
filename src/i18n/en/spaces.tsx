// Space bar, Space edit/delete dialogs and the Space navigator; see docs/features/completed/034-i18n-language-switch.md
import type { ReactNode } from 'react';

export const spaces = {
  // Special "All" Space (id 'all'); its stored/internal name stays 'All'
  allSpaceName: 'All',
  allSpaceBadge: 'ALL',

  // Space bar
  spaceBarLabel: 'SPACE',
  createNewSpace: 'Create new space',
  closeWindowWarning: 'This will close the window.',

  // Space context menu
  closeAllTabs: 'Close All Tabs',
  closeAllTabsInSpace: 'Close All Tabs In Space',

  // Space list / navigator
  navigateToSpace: 'Navigate to Space',
  navigatorWindowTitle: 'Space Navigator',
  searchSpacesPlaceholder: 'Search spaces...',
  noMatches: 'No matches',
  noSpacesAvailable: 'No spaces available',
  noFolder: 'No folder',
  current: 'current',
  noBookmarkFolderConfigured: (spaceName: string) => `"${spaceName}" has no bookmark folder configured`,

  // Create / edit dialog
  editDialog: {
    createTitle: 'Create Space',
    editTitle: 'Edit Space',
    namePlaceholder: 'Enter space name',
    nameRequired: 'Name is required',
    duplicateName: 'A space with this name already exists',
    otherBookmarksNotFound: 'Cannot find the Other Bookmarks folder',
    folderNoLongerExists: 'Selected folder no longer exists',
    otherBookmarksFallback: 'Other Bookmarks',
    folderNamePlaceholder: '{name}',
    bookmarkFolder: 'Bookmark Folder',
    bookmarkFolderHelp: 'Bookmarks saved in this space will be stored in this folder.',
    folderWillBeCreated: 'This folder will be created when saved',
    pickExistingFolder: 'Pick existing folder',
    selectBookmarkFolder: 'Select Bookmark Folder',
  },

  // Chrome tab group color names offered for a Space
  colorNames: {
    grey: 'Grey',
    blue: 'Blue',
    red: 'Red',
    yellow: 'Yellow',
    green: 'Green',
    pink: 'Pink',
    purple: 'Purple',
    cyan: 'Cyan',
    orange: 'Orange',
  },

  // Delete dialog
  deleteDialog: {
    title: 'Delete Space',
    confirm: (spaceName: string): ReactNode => <>Are you sure you want to delete <strong>"{spaceName}"</strong>?</>,
    details: 'Your bookmarks will not be deleted. Tabs in this space will be closed.',
  },
};
