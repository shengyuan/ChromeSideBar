import { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { Pin, BookOpen, LayoutGrid, Sparkles } from 'lucide-react';
import { useT, type Messages } from '../i18n';

interface WelcomeDialogProps
{
  isOpen: boolean;
  onClose: () => void;
}

interface PageContent
{
  title: string;
  description: string;
  image?: string;
  icon: React.ReactNode;
  isOverview?: boolean;
}

// Built per render (not module-level) so the text follows the current UI language
const getFeaturePreview = (t: Messages) => [
  {
    title: t.app.welcome.pinnedSitesTitle,
    description: t.app.welcome.pinnedSitesSummary,
    icon: <Pin size={18} />,
  },
  {
    title: t.app.welcome.liveBookmarksTitle,
    description: t.app.welcome.liveBookmarksSummary,
    icon: <BookOpen size={18} />,
  },
  {
    title: t.app.welcome.spacesTitle,
    description: t.app.welcome.spacesSummary,
    icon: <LayoutGrid size={18} />,
  },
];

const getPages = (t: Messages): PageContent[] => [
  {
    title: t.app.welcome.welcomeTitle,
    description: t.app.welcome.welcomeDescription,
    icon: <Sparkles size={20} />,
    isOverview: true,
  },
  {
    title: t.app.welcome.pinnedSitesTitle,
    description: t.app.welcome.pinnedSitesDescription,
    image: '/welcome/pinned-sites.png',
    icon: <Pin size={20} />,
  },
  {
    title: t.app.welcome.liveBookmarksTitle,
    description: t.app.welcome.liveBookmarksDescription,
    image: '/welcome/live-bookmarks.png',
    icon: <BookOpen size={20} />,
  },
  {
    title: t.app.welcome.spacesTitle,
    description: t.app.welcome.spacesDescription,
    image: '/welcome/spaces.png',
    icon: <LayoutGrid size={20} />,
  },
];

export function WelcomeDialog({ isOpen, onClose }: WelcomeDialogProps)
{
  const t = useT();
  const featurePreview = getFeaturePreview(t);
  const pages = getPages(t);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset to first page when dialog opens
  useEffect(() =>
  {
    if (isOpen)
    {
      setCurrentPage(0);
    }
  }, [isOpen]);

  const handleNext = () =>
  {
    if (currentPage < pages.length - 1)
    {
      setCurrentPage(currentPage + 1);
    }
    else
    {
      onClose();
    }
  };

  const handlePrev = () =>
  {
    if (currentPage > 0)
    {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClose = () =>
  {
    setCurrentPage(0);
    onClose();
  };

  const page = pages[currentPage];
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={t.app.welcome.dialogTitle}
      maxWidth="max-w-sm"
    >
      <div className="p-4">
        {page.isOverview ? (
          <>
            {/* Overview page content */}
            <div className="flex flex-col items-center mb-4">
              <img
                src="/icon.png"
                alt={t.app.welcome.iconAlt}
                className="w-16 h-16 mb-3"
              />
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {page.description}
              </p>
            </div>

            {/* Feature preview list */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4">
              {featurePreview.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`flex items-center gap-3 px-3 py-2.5 ${
                    index < featurePreview.length - 1
                      ? 'border-b border-gray-200 dark:border-gray-700'
                      : ''
                  }`}
                >
                  <span className="text-blue-500 flex-shrink-0">{feature.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Title with icon */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-500">{page.icon}</span>
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {page.title}
              </h4>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {page.description}
            </p>

            {/* Screenshot */}
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-4">
              <img
                src={page.image}
                alt={page.title}
                className="w-full h-auto"
              />
            </div>
          </>
        )}

        {/* Page indicator dots */}
        <div className="flex justify-center gap-2 mb-4">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={t.app.welcome.goToPage(index + 1)}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          {!isFirstPage ? (
            <button
              onClick={handlePrev}
              className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              {t.app.welcome.prev}
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNext}
            className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isLastPage ? t.app.welcome.getStarted : t.app.welcome.next}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
