import { getMessages } from '../i18n';

/**
 * Creates a Chrome API error handler for use in hooks.
 * @param context - Name for error logging (e.g., "Tab", "Bookmark")
 * @param setError - State setter for error message
 * @returns Error handler function that returns true if error occurred
 */
export const createChromeErrorHandler = (
  context: string,
  setError: (error: string | null) => void
) =>
{
  return (operation: string): boolean =>
  {
    const err = chrome.runtime.lastError;
    if (err)
    {
      console.error(`${context} ${operation} error:`, err.message);
      setError(err.message || getMessages().notices.operationFailed(operation));
      return true;
    }
    setError(null);
    return false;
  };
};
