import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'

import {
  formatReleaseDate,
  pickGalleryColumns,
  splitTitleLines,
} from './landing-template-model'
import './landing-template.css'

export type LandingAction = {
  href: string
  iconSrc?: string
  label: string
  target?: string
  variant?: 'primary' | 'ghost'
}

export type LandingFeature = {
  iconSrc?: string
  label: string
}

export type LandingHero = {
  /** Multiline titles use `\n` between lines. */
  title: string
  subtitle?: string
  imageSrc?: string
  imageAlt?: string
}

export type LandingPurpose = {
  label?: string
  heading: string
  paragraphs?: readonly string[]
  features?: readonly LandingFeature[]
  /** Gallery image URLs; the first four take part in the 3/4 fit. */
  gallery?: readonly string[]
  /** Gallery image aspect ratio (width / height) for the fit heuristic. */
  galleryImageRatio?: number
}

export type LandingTemplateProps = {
  /** Hero and (by default) footer CTA row. The first `primary` action gets the hover flash. */
  actions?: readonly LandingAction[]
  backHref?: string
  backIconSrc?: string
  backLabel?: string
  /** Frames for the primary-button hover flash (up to four are used). */
  flashImages?: readonly string[]
  hero: LandingHero
  legal?: string
  onNavigate?: (href: string, event: MouseEvent) => void
  productName: string
  productIconSrc?: string
  purpose?: LandingPurpose
  /** GitHub releases API endpoint; when set, the status line shows its latest release date. */
  releaseApiUrl?: string
  /** Footer CTA row; defaults to `actions`. */
  footerActions?: readonly LandingAction[]
  /** Static status line next to the back link (ignored while `releaseApiUrl` resolves). */
  statusPrefix?: string
  statusText?: string
}

const DEFAULT_GALLERY_RATIO = 1456 / 816

function ActionButton({
  action,
  flashStyle,
  onNavigate,
}: {
  action: LandingAction
  flashStyle?: CSSProperties
  onNavigate?: (href: string, event: MouseEvent) => void
}) {
  const variant = action.variant === 'ghost' ? 'ghost' : 'primary'
  const hasFlash = Boolean(flashStyle)
  return (
    <a
      className={[
        'landing-btn',
        `landing-btn-${variant}`,
        variant === 'primary' && hasFlash ? 'landing-has-flash' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      href={action.href}
      style={flashStyle}
      target={action.target}
      rel={action.target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={(event) => onNavigate?.(action.href, event)}
    >
      {action.iconSrc ? <img src={action.iconSrc} alt="" /> : null}
      {action.label}
    </a>
  )
}

/**
 * Full-page product landing layout: nav with back link and status line,
 * centered hero with CTA buttons and a wide screenshot, a two-column
 * purpose section (adaptive gallery + copy/features), and a brand footer.
 *
 * Route-agnostic like SiteTemplate: links are real anchors, and
 * `onNavigate` lets hosts intercept internal navigation. Dark mode keys
 * off a `.dark` class on any ancestor; the host owns theme switching.
 */
export function LandingTemplate({
  actions = [],
  backHref = '/',
  backIconSrc,
  backLabel = 'Back',
  flashImages,
  hero,
  legal,
  onNavigate,
  productName,
  productIconSrc,
  purpose,
  releaseApiUrl,
  footerActions = actions,
  statusPrefix = 'Last update:',
  statusText,
}: LandingTemplateProps) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState(statusText)

  /* refresh the status line from the newest GitHub release; keep the
     static text if the fetch fails */
  useEffect(() => {
    if (!releaseApiUrl) return
    let cancelled = false
    fetch(releaseApiUrl)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('release fetch failed'))))
      .then((release: { published_at?: string }) => {
        const date = new Date(release.published_at ?? '')
        if (!cancelled && !isNaN(date.getTime())) {
          setStatus(`${statusPrefix} ${formatReleaseDate(date)}`)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [releaseApiUrl, statusPrefix])

  /* desktop: 3 or 4 gallery images, whichever needs less cropping to fill the panel */
  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery || typeof window === 'undefined') return
    const ratio = purpose?.galleryImageRatio ?? DEFAULT_GALLERY_RATIO
    const fit = () => {
      const columns = pickGalleryColumns(gallery.offsetWidth, gallery.offsetHeight, ratio)
      gallery.classList.toggle('is-three', columns === 3)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [purpose?.galleryImageRatio, purpose?.gallery])

  /* hover-flash frames ride along as CSS custom properties on the primary button */
  const flashStyle = (() => {
    if (!flashImages?.length) return undefined
    const style: CSSProperties & Record<string, string> = {}
    flashImages.slice(0, 4).forEach((src, index) => {
      style[`--landing-flash-${index + 1}`] = `url(${src})`
    })
    return style
  })()

  const galleryImages = purpose?.gallery ?? []
  const primaryFlash = actions.find((action) => action.variant !== 'ghost')

  return (
    <div className="landing-template">
      <nav className="landing-nav">
        <a
          className="landing-nav-back"
          href={backHref}
          onClick={(event) => onNavigate?.(backHref, event)}
        >
          {backIconSrc ? <img src={backIconSrc} alt="" /> : null}
          {backLabel}
        </a>
        {status ? <span className="landing-nav-status">{status}</span> : null}
      </nav>

      <header className="landing-hero">
        <h1>{splitTitleLines(hero.title).map((line, index, lines) => (
          <span key={line}>
            {line}
            {index < lines.length - 1 ? <br /> : null}
          </span>
        ))}</h1>
        {hero.subtitle ? <p className="landing-sub">{hero.subtitle}</p> : null}
        {actions.length > 0 ? (
          <div className="landing-actions">
            {actions.map((action) => (
              <ActionButton
                key={`${action.label}-${action.href}`}
                action={action}
                flashStyle={action === primaryFlash ? flashStyle : undefined}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : null}
        {hero.imageSrc ? (
          <div className="landing-hero-image">
            <img src={hero.imageSrc} alt={hero.imageAlt ?? ''} />
          </div>
        ) : null}
      </header>

      {purpose ? (
        <section className="landing-purpose">
          {galleryImages.length > 0 ? (
            <div className="landing-gallery" ref={galleryRef} aria-hidden="true">
              <div className="landing-gallery-track">
                {galleryImages.slice(0, 4).map((src, index) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={index === 3 ? 'landing-gallery-extra' : undefined}
                  />
                ))}
                {galleryImages.slice(0, 4).map((src) => (
                  <img key={`dup-${src}`} src={src} alt="" className="landing-gallery-dup" />
                ))}
              </div>
            </div>
          ) : null}

          <div className="landing-info">
            {purpose.label ? <p className="landing-label">{purpose.label}</p> : null}
            <h2>{splitTitleLines(purpose.heading).map((line, index, lines) => (
              <span key={line}>
                {line}
                {index < lines.length - 1 ? <br /> : null}
              </span>
            ))}</h2>
            {purpose.paragraphs?.length ? (
              <div className="landing-copy">
                {purpose.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            {purpose.features?.length ? (
              <ul className="landing-features">
                {purpose.features.map((feature) => (
                  <li key={feature.label}>
                    {feature.iconSrc ? <img src={feature.iconSrc} alt="" /> : null}
                    {feature.label}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          {productIconSrc ? <img src={productIconSrc} alt={productName} /> : null}
          <span>{productName}</span>
        </div>
        {footerActions.length > 0 ? (
          <div className="landing-actions">
            {footerActions.map((action) => (
              <ActionButton
                key={`${action.label}-${action.href}`}
                action={action}
                flashStyle={action === primaryFlash ? flashStyle : undefined}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : null}
      </footer>

      {legal ? <p className="landing-legal">{legal}</p> : null}
    </div>
  )
}
