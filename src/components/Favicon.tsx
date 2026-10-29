import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { faviconTones } from '../utils/faviconTone';
import { getFaviconUrl } from '../utils/favicon';

/**
 * True when the favicon at src is mostly dark and would disappear on the dark theme's background.
 * Each src is analyzed once and cached.
 */
const useIsDarkFavicon = (src: string): boolean =>
{
  const [analyzed, setAnalyzed] = useState<{ src: string; isDark: boolean } | null>(null);

  useEffect(() =>
  {
    // Already known: rendered below from the cache, no state update needed
    if (faviconTones.getKnown(src) !== undefined)
    {
      return;
    }

    let cancelled = false;
    faviconTones.isDark(src).then(isDark =>
    {
      if (!cancelled)
      {
        setAnalyzed({ src, isDark });
      }
    });
    return () =>
    {
      cancelled = true;
    };
  }, [src]);

  // Read the cache first so a remounted row shows the right tone without a flash
  const known = faviconTones.getKnown(src);
  if (known !== undefined)
  {
    return known;
  }
  return analyzed?.src === src ? analyzed.isDark : false;
};

type FaviconProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  // The page the icon belongs to, when src is the website's own icon URL (e.g.
  // tab.favIconUrl). Chrome's cached copy of the page's icon is then used to
  // judge the tone (src is cross-origin, so unreadable) and is shown instead
  // when src can't be loaded, e.g. a server sending
  // Cross-Origin-Resource-Policy: same-origin.
  pageUrl?: string;
};

/**
 * Favicon <img> that stays visible in the dark theme: mostly dark icons
 * (e.g. GitHub's black logo) are shown inverted there. The light theme is unchanged.
 */
export const Favicon: React.FC<FaviconProps> = ({ src, pageUrl, className, alt = '', onError, ...rest }) =>
{
  const cachedSrc = pageUrl ? getFaviconUrl(pageUrl) : undefined;
  // The src that failed to load, so a new src gets its own try
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showCached = !!cachedSrc && failedSrc === src;

  const isDark = useIsDarkFavicon(cachedSrc ?? src);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) =>
  {
    // Fall back to Chrome's cached copy once; report errors after that
    if (cachedSrc && !showCached && cachedSrc !== src)
    {
      setFailedSrc(src);
      return;
    }
    onError?.(e);
  };

  return (
    <img
      src={showCached ? cachedSrc : src}
      alt={alt}
      className={clsx(className, isDark && 'dark:invert dark:hue-rotate-180')}
      onError={handleError}
      {...rest}
    />
  );
};
