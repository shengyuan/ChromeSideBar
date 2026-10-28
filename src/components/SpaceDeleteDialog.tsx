import React from 'react';
import { Dialog } from './Dialog';
import { Space } from '../contexts/SpacesContext';
import { useT } from '../i18n';

interface SpaceDeleteDialogProps
{
  isOpen: boolean;
  space: Space | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const SpaceDeleteDialog: React.FC<SpaceDeleteDialogProps> = ({
  isOpen,
  space,
  onClose,
  onConfirm,
}) =>
{
  const t = useT();
  if (!space) return null;

  const handleConfirm = () =>
  {
    onConfirm();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t.spaces.deleteDialog.title} maxWidth="max-w-xs">
      <div className="flex flex-col">
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300">
            {t.spaces.deleteDialog.confirm(space.name)}
          </p>
          <p className="mt-2 text-[0.85em] text-gray-500 dark:text-gray-400">
            {t.spaces.deleteDialog.details}
          </p>
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
            {t.common.delete}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
