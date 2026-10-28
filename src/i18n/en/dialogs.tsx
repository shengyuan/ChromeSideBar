// Generic dialogs: bookmark edit/create, folder picker, tab group dialogs, delete confirmation;
// see docs/features/completed/034-i18n-language-switch.md
import type { ReactNode } from 'react';

export const dialogs = {
  closeDialog: 'Close dialog',

  // Bookmark edit / create dialogs
  newBookmark: 'New Bookmark',
  editBookmark: 'Edit Bookmark',
  editFolder: 'Edit Folder',
  newFolder: 'New Folder',
  folderName: 'Folder Name',
  enterFolderName: 'Enter folder name',

  // Folder picker
  newFolderNamePlaceholder: 'New folder name',
  selectFolder: 'Select',

  // Tab group dialogs
  addToGroup: 'Add to Group',
  createNewGroup: 'Create New Group',
  renameGroup: 'Rename Group',
  changeGroupColor: 'Change Group Color',
  groupName: 'Group Name',
  enterGroupName: 'Enter group name',
  unnamedGroup: 'Unnamed Group',
  selectColor: 'Select Color',
  // color is one of groupColorNames
  selectColorLabel: (color: string) => `Select ${color} color`,
  // Display names for Chrome's tab group color ids (the ids themselves stay English)
  groupColorNames: {
    grey: 'grey',
    blue: 'blue',
    red: 'red',
    yellow: 'yellow',
    green: 'green',
    pink: 'pink',
    purple: 'purple',
    cyan: 'cyan',
    orange: 'orange',
  },

  // Close tabs / delete bookmarks confirmation; countNode is the rendered (bold) count
  confirmDelete: {
    closeTabsTitle: (count: number) => `Close ${count} ${count === 1 ? 'tab' : 'tabs'}`,
    deleteBookmarksTitle: (count: number) => `Delete ${count} ${count === 1 ? 'bookmark' : 'bookmarks'}`,
    closeTabsQuestion: (countNode: ReactNode, count: number): ReactNode =>
      <>Are you sure you want to close {countNode} {count === 1 ? 'tab' : 'tabs'}?</>,
    deleteBookmarksQuestion: (countNode: ReactNode, count: number): ReactNode =>
      <>Are you sure you want to delete {countNode} {count === 1 ? 'bookmark' : 'bookmarks'}?</>,
    cannotBeUndone: 'This action cannot be undone.',
  },
};
