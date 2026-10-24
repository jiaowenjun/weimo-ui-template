/** Format a release timestamp as `M/D/YY` (e.g. `9/24/26`). */
export function formatReleaseDate(date: Date): string {
  const year = String(date.getFullYear()).slice(2)
  return `${date.getMonth() + 1}/${date.getDate()}/${year}`
}

/**
 * Decide whether the desktop gallery column should stack 3 or 4 images.
 * Whichever count needs less cropping (log-distance of per-image height
 * vs the natural height at this ratio) wins; ties favor 3, which crops
 * each image less.
 */
export function pickGalleryColumns(
  width: number,
  height: number,
  imageRatio: number
): 3 | 4 {
  if (!width || !height || imageRatio <= 0) return 4
  const naturalHeight = width / imageRatio
  const three = Math.abs(Math.log(height / 3 / naturalHeight))
  const four = Math.abs(Math.log(height / 4 / naturalHeight))
  return three <= four ? 3 : 4
}

/** Split a hero title on newlines so hosts can pass multi-line headings. */
export function splitTitleLines(title: string): string[] {
  return title.split('\n').map((line) => line.trim()).filter(Boolean)
}
