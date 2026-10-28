import React from 'react';
import { Dialog } from './Dialog';
import { useT } from '../i18n';

interface ConfirmDeleteDialogProps
{
  isOpen: boolean;
  itemCount: number;
  itemType: 'tabs' | 'bookmarks';
  details?: string;  // e.g., "3 tabs, 2 groups"
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  itemCount,
  itemType,
  details,
  onConfirm,
  onClose,
}) =>
{
  const t = useT();
  const handleConfirm = () =>
  {
    onConfirm();
    onClose();
  };

  const countNode = <strong>{itemCount}</strong>;
  const dialogTitle = itemType === 'tabs'
    ? t.dialogs.confirmDelete.closeTabsTitle(itemCount)
    : t.dialogs.confirmDelete.deleteBookmarksTitle(itemCount);
  const question = itemType === 'tabs'
    ? t.dialogs.confirmDelete.closeTabsQuestion(countNode, itemCount)
    : t.dialogs.confirmDelete.deleteBookmarksQuestion(countNode, itemCount);
  const confirmLabel = itemType === 'tabs' ? t.common.close : t.common.delete;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={dialogTitle} maxWidth="max-w-xs">
      <div className="flex flex-col">
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300">
            {question}
          </p>
          {details && (
            <p className="mt-1 text-[0.85em] text-gray-500 dark:text-gray-400">
              {details}
            </p>
          )}
          {itemType === 'bookmarks' && (
            <p className="mt-2 text-[0.85em] text-gray-500 dark:text-gray-400">
              {t.dialogs.confirmDelete.cannotBeUndone}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleConfirm}
            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
