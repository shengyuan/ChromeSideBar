import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { faviconTones } from '../utils/faviconTone';

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
  // Same icon from a readable source, used to judge its tone when src is a
  // website URL (cross-origin, unreadable). Usually getFaviconUrl(pageUrl).
  toneSrc?: string;
};

/**
 * Favicon <img> that stays visible in the dark theme: mostly dark icons
 * (e.g. GitHub's black logo) are shown inverted there. The light theme is unchanged.
 */
export const Favicon: React.FC<FaviconProps> = ({ src, toneSrc, className, alt = '', ...rest }) =>
{
  const isDark = useIsDarkFavicon(toneSrc ?? src);
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(className, isDark && 'dark:invert dark:hue-rotate-180')}
      {...rest}
    />
  );
};
