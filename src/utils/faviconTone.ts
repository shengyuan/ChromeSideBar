// Decides whether a favicon would disappear on the dark theme's near-black background
// (e.g. GitHub's black logo on a transparent background), so it can be shown inverted there.

// Size the icon is scaled to before its pixels are measured
const SAMPLE_SIZE = 32;
// Pixels more transparent than this count as background and are skipped
const MIN_ALPHA = 128;
// A pixel at least this bright (relative luminance) stands out on the dark background
const VISIBLE_LUMINANCE = 0.3;
// Dark icon: the drawn pixels average below this luminance (about 3:1 contrast on gray-900)...
const MAX_MEAN_LUMINANCE = 0.12;
// ...and fewer than this share of them are bright (a white logo on a black tile stays as is)
const MAX_VISIBLE_SHARE = 0.1;
// Images with less drawn area than this are treated as empty
const MIN_COVERAGE = 0.03;

// sRGB channel value (0-255) -> linear light, for relative luminance
const SRGB_TO_LINEAR = Array.from({ length: 256 }, (_, value) =>
{
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
});

/**
 * Classifies RGBA pixel data (as returned by getImageData) as a dark icon.
 * Pure function so it can be tested without a canvas.
 */
export const isDarkIconPixels = (data: Uint8ClampedArray | number[]): boolean =>
{
  const totalPixels = data.length / 4;
  let drawnPixels = 0;
  let visiblePixels = 0;
  let luminanceSum = 0;

  // Measure the brightness of the icon's drawn (non-transparent) pixels
  for (let i = 0; i < data.length; i += 4)
  {
    if (data[i + 3] < MIN_ALPHA)
    {
      continue;
    }
    const luminance = 0.2126 * SRGB_TO_LINEAR[data[i]]
      + 0.7152 * SRGB_TO_LINEAR[data[i + 1]]
      + 0.0722 * SRGB_TO_LINEAR[data[i + 2]];
    drawnPixels++;
    luminanceSum += luminance;
    if (luminance >= VISIBLE_LUMINANCE)
    {
      visiblePixels++;
    }
  }

  if (totalPixels === 0 || drawnPixels < totalPixels * MIN_COVERAGE)
  {
    return false;
  }
  return luminanceSum / drawnPixels < MAX_MEAN_LUMINANCE
    && visiblePixels / drawnPixels < MAX_VISIBLE_SHARE;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) =>
  {
    const image = new Image();
    // A tab's favIconUrl is cross-origin: its pixels can only be read if the server allows CORS.
    // Otherwise loading fails and the icon is left as is.
    if (/^https?:/i.test(src))
    {
      image.crossOrigin = 'anonymous';
    }
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load favicon'));
    image.src = src;
  });

let sampleCanvas: HTMLCanvasElement | undefined;

const analyzeIsDark = async (src: string): Promise<boolean> =>
{
  try
  {
    const image = await loadImage(src);
    sampleCanvas ??= document.createElement('canvas');
    sampleCanvas.width = SAMPLE_SIZE;
    sampleCanvas.height = SAMPLE_SIZE;
    const context = sampleCanvas.getContext('2d', { willReadFrequently: true });
    if (!context)
    {
      return false;
    }
    context.clearRect(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    return isDarkIconPixels(context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data);
  }
  catch
  {
    // Unreadable image (load error, tainted canvas): leave it unchanged
    return false;
  }
};

/**
 * Caches the dark/not-dark result per favicon src, so each icon is analyzed once
 * even when many rows show it at the same time.
 */
class FaviconToneCache
{
  private results = new Map<string, boolean>();
  private pending = new Map<string, Promise<boolean>>();

  /** The result for src if it has already been analyzed, otherwise undefined */
  getKnown(src: string): boolean | undefined
  {
    return this.results.get(src);
  }

  /** Analyzes src once; concurrent and later calls share the same result */
  isDark(src: string): Promise<boolean>
  {
    const known = this.results.get(src);
    if (known !== undefined)
    {
      return Promise.resolve(known);
    }

    let analysis = this.pending.get(src);
    if (!analysis)
    {
      analysis = analyzeIsDark(src).then(isDark =>
      {
        this.results.set(src, isDark);
        this.pending.delete(src);
        return isDark;
      });
      this.pending.set(src, analysis);
    }
    return analysis;
  }
}

export const faviconTones = new FaviconToneCache();
