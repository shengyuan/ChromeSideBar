import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { Dialog } from './Dialog';
import { FolderPickerDialog } from './FolderPickerDialog';
import { IconColorPicker, ColorOption } from './IconColorPicker';
import { useBookmarks } from '../hooks/useBookmarks';
import { Space } from '../contexts/SpacesContext';
import { GROUP_COLOR_OPTIONS } from '../utils/groupColors';
import { getIconUrl } from '../utils/iconify';
import { isEmoji } from '../utils/emoji';
import { Folder, FolderOpen } from 'lucide-react';
import { useT } from '../i18n';

interface SpaceEditDialogProps
{
  isOpen: boolean;
  space: Space | null; // null = create mode, Space = edit mode
  existingSpaces: readonly Space[]; // all spaces for duplicate name validation
  onClose: () => void;
  onSave: (spaceData: {
    name: string;
    icon: string;
    color: string;
    bookmarkFolderPath: string;
    bookmarkFolderSegments: string[];
  }) => void | Promise<void>;
}

export const SpaceEditDialog: React.FC<SpaceEditDialogProps> = ({
  isOpen,
  space,
  existingSpaces,
  onClose,
  onSave,
}) =>
{
  const t = useT();
  const isCreateMode = space === null;
  const { createFolder, getBookmarkSegments, findFolderBySegments, getRootFolder } = useBookmarks();

  // Convert GROUP_COLOR_OPTIONS to ColorOption format for IconColorPicker
  const spaceColorOptions: ColorOption[] = useMemo(() => GROUP_COLOR_OPTIONS.map((opt) => ({
    value: opt.value,
    name: t.spaces.colorNames[opt.value],
    className: opt.dot,
  })), [t]);

  // Form state
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('briefcase');
  const [color, setColor] = useState<string>('blue');
  const [customHexInput, setCustomHexInput] = useState('');
  const [bookmarkFolderPath, setBookmarkFolderPath] = useState('');
  const [bookmarkFolderSegments, setBookmarkFolderSegments] = useState<string[]>([]);
  const [useExistingFolder, setUseExistingFolder] = useState(false);

  // Folder picker dialog state
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  // Validation state
  const [nameError, setNameError] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset form when dialog opens
  useEffect(() =>
  {
    if (isOpen)
    {
      if (space)
      {
        // Edit mode - populate with space data
        setName(space.name);
        setIcon(space.icon);
        setColor(space.color);
        // If it's a custom hex color, pre-fill the hex input
        setCustomHexInput(space.color.startsWith('#') ? space.color : '');
        setBookmarkFolderPath(space.bookmarkFolderPath);
        setBookmarkFolderSegments(space.bookmarkFolderSegments ?? []);
        setUseExistingFolder(true);
      }
      else
      {
        // Create mode - reset to defaults
        setName('');
        setIcon('briefcase');
        setColor('blue');
        setBookmarkFolderPath('');
        setBookmarkFolderSegments([]);
        setUseExistingFolder(false);
      }
      setNameError('');
    }
  }, [isOpen, space]);

  // Validate name
  const validateName = useCallback((value: string): boolean =>
  {
    const trimmedValue = value.trim();
    if (!trimmedValue)
    {
      setNameError(t.spaces.editDialog.nameRequired);
      return false;
    }

    // Check for duplicate name (case-insensitive)
    const isDuplicate = existingSpaces.some(s =>
      s.name.trim().toLowerCase() === trimmedValue.toLowerCase() &&
      s.id !== space?.id  // Exclude current space in edit mode
    );
    if (isDuplicate)
    {
      setNameError(t.spaces.editDialog.duplicateName);
      return false;
    }

    setNameError('');
    return true;
  }, [existingSpaces, space, t]);

  // Debounced validation as user types
  useEffect(() =>
  {
    // Clear any existing timer
    if (debounceTimerRef.current)
    {
      clearTimeout(debounceTimerRef.current);
    }

    // Only validate if there's input (don't show error for empty field while typing)
    if (name.trim())
    {
      debounceTimerRef.current = setTimeout(() =>
      {
        validateName(name);
      }, 300);
    }
    else
    {
      // Clear error when field is emptied (will show on blur/save)
      setNameError('');
    }

    return () =>
    {
      if (debounceTimerRef.current)
      {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [name, validateName]);

  // Handle folder selection from picker
  const handleFolderSelect = useCallback(async (folderId: string) =>
  {
    setShowFolderPicker(false);
    try
    {
      const segments = await getBookmarkSegments(folderId);
      setBookmarkFolderSegments(segments);
      setBookmarkFolderPath(segments.join('/'));
      setUseExistingFolder(true);
    }
    catch (error)
    {
      console.error('Failed to get folder path:', error);
    }
  }, [getBookmarkSegments]);

  // Handle save
  const handleSave = useCallback(async () =>
  {
    if (!validateName(name)) return;

    let finalPath = bookmarkFolderPath;
    let finalSegments = bookmarkFolderSegments;

    // If creating new space without existing folder, find or create the folder
    if (isCreateMode && !useExistingFolder)
    {
      const folderName = name.trim();
      const otherBookmarks = getRootFolder('other');
      if (!otherBookmarks)
      {
        setNameError(t.spaces.editDialog.otherBookmarksNotFound);
        return;
      }

      // Check if folder already exists under Other Bookmarks
      const targetSegments = [otherBookmarks.title, folderName];
      const existingFolder = findFolderBySegments(targetSegments);
      if (existingFolder)
      {
        finalSegments = targetSegments;
        finalPath = targetSegments.join('/');
      }
      else
      {
        // Create folder under Other Bookmarks, then get its segments
        await new Promise<void>((resolve, reject) =>
        {
          createFolder(otherBookmarks.id, folderName, async (newFolder) =>
          {
            if (newFolder)
            {
              finalSegments = await getBookmarkSegments(newFolder.id);
              finalPath = finalSegments.join('/');
              resolve();
            }
            else
            {
              reject(new Error('Failed to create folder'));
            }
          });
        });
      }
    }

    // In edit mode, check if the configured folder still exists
    if (!isCreateMode && bookmarkFolderSegments.length > 0)
    {
      const folder = findFolderBySegments(bookmarkFolderSegments);
      if (!folder)
      {
        setNameError(t.spaces.editDialog.folderNoLongerExists);
        return;
      }
    }

    onSave({
      name: name.trim(),
      icon,
      color,
      bookmarkFolderPath: finalPath,
      bookmarkFolderSegments: finalSegments,
    });
    onClose();
  }, [
    name,
    icon,
    color,
    bookmarkFolderPath,
    bookmarkFolderSegments,
    isCreateMode,
    useExistingFolder,
    validateName,
    createFolder,
    findFolderBySegments,
    getBookmarkSegments,
    getRootFolder,
    onSave,
    onClose,
    t
  ]);

  // Display text for folder section
  const getFolderDisplayText = (): string =>
  {
    if (useExistingFolder && bookmarkFolderPath)
    {
      return bookmarkFolderPath;
    }
    const otherBookmarksTitle = getRootFolder('other')?.title || t.spaces.editDialog.otherBookmarksFallback;
    if (name.trim())
    {
      return `${otherBookmarksTitle}/${name.trim()}`;
    }
    return `${otherBookmarksTitle}/${t.spaces.editDialog.folderNamePlaceholder}`;
  };

  // Handle emoji selection - sets icon to the emoji string
  const handleEmojiSelect = useCallback((emoji: string) =>
  {
    setIcon(emoji);
  }, []);

  // Handle icon selection - sets icon to Lucide name (clears any emoji)
  const handleIconSelect = useCallback((iconName: string) =>
  {
    setIcon(iconName);
  }, []);

  // Handle custom hex color submit
  const handleCustomHexSubmit = useCallback(() =>
  {
    const hex = customHexInput.trim();
    if (/^#?[0-9A-Fa-f]{6}$/.test(hex))
    {
      const normalized = hex.startsWith('#') ? hex : `#${hex}`;
      setColor(normalized);
      setCustomHexInput(normalized);
    }
  }, [customHexInput]);

  // Current icon preview for IconColorPicker
  const currentIconPreview = useMemo(() =>
  {
    if (!icon) return null;
    if (isEmoji(icon))
    {
      return <span className="text-xl leading-none">{icon}</span>;
    }
    return (
      <img
        src={getIconUrl(icon)}
        alt={icon}
        width={20}
        height={20}
        className="dark:invert"
      />
    );
  }, [icon]);

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        title={isCreateMode ? t.spaces.editDialog.createTitle : t.spaces.editDialog.editTitle}
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col">
          {/* Form content */}
          <div className="p-3 space-y-4">
            {/* Name input */}
            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.common.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => validateName(name)}
                placeholder={t.spaces.editDialog.namePlaceholder}
                className={clsx(
                  "w-full px-2 py-1.5 border rounded",
                  "dark:bg-gray-900 dark:text-white",
                  "focus:ring-1 focus:ring-blue-500 outline-none",
                  nameError
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                )}
                autoFocus
              />
              {nameError && (
                <p className="mt-1 text-[0.85em] text-red-500">{nameError}</p>
              )}
            </div>

            {/* Icon and Color picker */}
            <IconColorPicker
              selectedIcon={isEmoji(icon) ? undefined : icon}
              selectedColor={color}
              currentIconPreview={currentIconPreview}
              onIconSelect={handleIconSelect}
              onColorSelect={setColor}
              colorOptions={spaceColorOptions}
              selectedEmoji={isEmoji(icon) ? icon : undefined}
              onEmojiSelect={handleEmojiSelect}
              iconGridHeight={90}
              showCustomHex
              customHexValue={customHexInput}
              onCustomHexChange={setCustomHexInput}
              onCustomHexSubmit={handleCustomHexSubmit}
              currentCustomColor={color}
            />

            {/* Bookmark folder */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-gray-700 dark:text-gray-300">
                  {t.spaces.editDialog.bookmarkFolder}
                </label>
                <div className="relative group">
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 cursor-help"
                  >
                    ?
                  </span>
                  <div className="absolute right-0 bottom-full mb-1 hidden group-hover:block w-48 px-2 py-1 text-[0.8em] text-white bg-gray-800 dark:bg-gray-700 rounded shadow-lg z-10 pointer-events-none">
                    {t.spaces.editDialog.bookmarkFolderHelp}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 border rounded bg-gray-50 dark:bg-gray-900 dark:border-gray-600">
                {useExistingFolder ? (
                  <FolderOpen size={14} className="text-yellow-500 flex-shrink-0" />
                ) : (
                  <Folder size={14} className="text-gray-400 flex-shrink-0" />
                )}
                <span
                  className={clsx(
                    "truncate",
                    useExistingFolder
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-400 dark:text-gray-500 italic"
                  )}
                  title={getFolderDisplayText()}
                >
                  {getFolderDisplayText()}
                </span>
              </div>
              {isCreateMode && !useExistingFolder && (
                <p className="mt-1 text-[0.85em] text-gray-500 dark:text-gray-400">
                  {t.spaces.editDialog.folderWillBeCreated}
                </p>
              )}
              <button
                onClick={() => setShowFolderPicker(true)}
                className="mt-1 px-2 py-1 text-[0.85em] text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded border border-blue-300 dark:border-blue-600"
              >
                {t.spaces.editDialog.pickExistingFolder}
              </button>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreateMode ? t.common.create : t.common.save}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Folder picker dialog */}
      <FolderPickerDialog
        isOpen={showFolderPicker}
        title={t.spaces.editDialog.selectBookmarkFolder}
        onSelect={handleFolderSelect}
        onClose={() => setShowFolderPicker(false)}
      />
    </>
  );
};
