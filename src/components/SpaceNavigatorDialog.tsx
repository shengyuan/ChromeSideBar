import { useCallback, useState, useMemo, useRef } from 'react';
import { QuickDismissDialog } from './QuickDismissDialog';
import { SpaceList, useSpaceListKeyboard, useSpaceListHighlight, getSpaceDisplayName } from './SpaceList';
import { useSpacesContext } from '../contexts/SpacesContext';
import { Space } from '../utils/spaceMessages';
import { useT } from '../i18n';

export interface SpaceNavigatorDialogProps
{
  isOpen: boolean;
  onClose: () => void;
  // Optional customization
  title?: string;
  hideAllSpace?: boolean;
  excludeSpaceId?: string;
  requireBookmarkFolder?: boolean;
  // Return error message string to keep dialog open and show error, or void/undefined to close
  onSelectSpace?: (spaceId: string) => Promise<string | void> | string | void;
  showCurrentIndicator?: boolean;
}

export const SpaceNavigatorDialog = ({
  isOpen,
  onClose,
  title,
  hideAllSpace = false,
  excludeSpaceId,
  requireBookmarkFolder = false,
  onSelectSpace,
  showCurrentIndicator = true
}: SpaceNavigatorDialogProps) =>
{
  const t = useT();
  const { allSpaces, spaces, switchToSpace, activeSpaceId } = useSpacesContext();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Filter spaces based on options
  const filteredSpaces = useMemo(() =>
  {
    let result = hideAllSpace ? spaces : allSpaces;
    if (excludeSpaceId)
    {
      result = result.filter(s => s.id !== excludeSpaceId);
    }
    return result;
  }, [allSpaces, spaces, hideAllSpace, excludeSpaceId]);

  const isItemDisabled = useCallback((space: Space) =>
    requireBookmarkFolder && !space.bookmarkFolderPath,
  [requireBookmarkFolder]);

  const handleSelectSpace = useCallback(async (spaceId: string, spaceName: string, isDisabled: boolean) =>
  {
    if (isDisabled)
    {
      setErrorMessage(t.spaces.noBookmarkFolderConfigured(spaceName));
      return;
    }

    setErrorMessage(null);
    if (onSelectSpace)
    {
      const error = await onSelectSpace(spaceId);
      if (error)
      {
        setErrorMessage(error);
        return;
      }
    }
    else
    {
      switchToSpace(spaceId);
    }
    onClose();
  }, [switchToSpace, onSelectSpace, onClose, t]);

  // Unified select handler used by both SpaceList clicks and keyboard shortcuts
  const handleSelect = useCallback((spaceId: string) =>
  {
    const space = filteredSpaces.find(s => s.id === spaceId);
    if (!space) return;
    handleSelectSpace(spaceId, getSpaceDisplayName(space, t), isItemDisabled(space));
  }, [filteredSpaces, handleSelectSpace, isItemDisabled, t]);

  // Clears error and scrolls to the active space whenever the dialog opens
  const clearError = useCallback(() => setErrorMessage(null), []);
  useSpaceListHighlight({
    spaces: filteredSpaces,
    activeSpaceId,
    setHighlightedIndex,
    itemRefs,
    enabled: isOpen,
    onActivate: clearError,
  });

  // displaySpaces is the search-filtered subset of filteredSpaces
  const { filteredSpaces: displaySpaces, searchQuery, onSearchChange, searchInputRef } = useSpaceListKeyboard({
    spaces: filteredSpaces,
    highlightedIndex,
    setHighlightedIndex,
    onSelect: handleSelect,
    itemRefs,
    enabled: isOpen,
  });

  return (
    <QuickDismissDialog isOpen={isOpen} onClose={onClose} title={title ?? t.spaces.navigateToSpace}>
      <SpaceList
        spaces={displaySpaces}
        highlightedIndex={highlightedIndex}
        activeSpaceId={activeSpaceId}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchInputRef={searchInputRef}
        onSelect={handleSelect}
        onHighlight={setHighlightedIndex}
        itemRefs={itemRefs}
        isDisabled={isItemDisabled}
        showCurrentIndicator={showCurrentIndicator}
        errorMessage={errorMessage}
      />
    </QuickDismissDialog>
  );
};
