import { describe, expect, it } from 'vitest'

import {
  formatReleaseDate,
  pickGalleryColumns,
  splitTitleLines,
} from '../src/components/landing-template/landing-template-model'

describe('landing template model', () => {
  it('formats release dates as M/D/YY', () => {
    expect(formatReleaseDate(new Date(2026, 8, 24))).toBe('9/24/26')
    expect(formatReleaseDate(new Date(2026, 0, 5))).toBe('1/5/26')
    expect(formatReleaseDate(new Date(1999, 11, 31))).toBe('12/31/99')
  })

  it('picks 3 or 4 gallery columns by least cropping', () => {
    const ratio = 1456 / 816
    // panel where three stacked images land exactly on the natural height
    const natural = 720 / ratio
    expect(pickGalleryColumns(720, natural * 3, ratio)).toBe(3)
    expect(pickGalleryColumns(720, natural * 4, ratio)).toBe(4)
    // the 3/4 boundary sits at sqrt(12) ≈ 3.464 × natural height
    expect(pickGalleryColumns(720, natural * 3.4, ratio)).toBe(3)
    expect(pickGalleryColumns(720, natural * 3.6, ratio)).toBe(4)
    // degenerate sizes fall back to 4
    expect(pickGalleryColumns(0, 100, ratio)).toBe(4)
    expect(pickGalleryColumns(720, 100, 0)).toBe(4)
  })

  it('splits hero titles into trimmed non-empty lines', () => {
    expect(splitTitleLines('The Photoshop\nalternative for Mac')).toEqual([
      'The Photoshop',
      'alternative for Mac',
    ])
    expect(splitTitleLines('  Single  ')).toEqual(['Single'])
    expect(splitTitleLines('\n\n')).toEqual([])
  })
})
