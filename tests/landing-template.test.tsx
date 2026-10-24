import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { LandingTemplate } from '../src/components/landing-template/landing-template'

describe('LandingTemplate', () => {
  it('renders hero title lines, actions, purpose sections, and footer', () => {
    render(
      <LandingTemplate
        actions={[
          { href: '/download', label: 'Download', variant: 'primary' },
          { href: 'https://github.com/x', label: 'GitHub', target: '_blank', variant: 'ghost' },
        ]}
        hero={{ title: 'Line one\nLine two', subtitle: 'Free forever' }}
        legal="Not affiliated with anyone."
        productName="Example"
        purpose={{
          label: 'Purpose',
          heading: 'All the tools',
          paragraphs: ['First paragraph.', 'Second paragraph.'],
          features: [
            { label: 'Layers' },
            { iconSrc: '/ic-layer.png', label: 'Masks' },
          ],
          gallery: ['/a.png', '/b.png', '/c.png'],
        }}
        statusText="Last update: 1/1/26"
      />,
    )

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Line oneLine two')
    expect(screen.getByText('Free forever')).toBeTruthy()
    // footerActions default to actions, so each label renders twice (hero + footer)
    expect(screen.getAllByText('Download')).toHaveLength(2)
    expect(screen.getAllByText('GitHub')).toHaveLength(2)
    expect(screen.getByText('First paragraph.')).toBeTruthy()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Example')).toBeTruthy()
    expect(screen.getByText('Not affiliated with anyone.')).toBeTruthy()
    expect(screen.getByText('Last update: 1/1/26')).toBeTruthy()
  })

  it('marks the fourth gallery image as extra and duplicates the set for the mobile loop', () => {
    const { container } = render(
      <LandingTemplate
        hero={{ title: 'Title' }}
        productName="Example"
        purpose={{ heading: 'H', gallery: ['/a.png', '/b.png', '/c.png', '/d.png'] }}
      />,
    )
    const track = container.querySelector('.landing-gallery-track')
    expect(track).toBeTruthy()
    expect(track!.querySelectorAll('img')).toHaveLength(8)
    expect(track!.querySelectorAll('.landing-gallery-extra')).toHaveLength(1)
    expect(track!.querySelectorAll('.landing-gallery-dup')).toHaveLength(4)
  })

  it('passes flash frames to the primary action as CSS custom properties', () => {
    const { container } = render(
      <LandingTemplate
        actions={[{ href: '/dl', label: 'Download', variant: 'primary' }]}
        flashImages={['/1.png', '/2.png']}
        hero={{ title: 'Title' }}
        productName="Example"
      />,
    )
    const primary = container.querySelector<HTMLAnchorElement>('.landing-btn-primary')
    expect(primary?.classList.contains('landing-has-flash')).toBe(true)
    expect(primary?.style.getPropertyValue('--landing-flash-1')).toBe('url(/1.png)')
    expect(primary?.style.getPropertyValue('--landing-flash-2')).toBe('url(/2.png)')
  })

  it('fires onNavigate for the back link and actions', () => {
    const onNavigate = vi.fn()
    const { container } = render(
      <LandingTemplate
        actions={[{ href: '/dl', label: 'Download', variant: 'primary' }]}
        backHref="/docs"
        hero={{ title: 'Title' }}
        onNavigate={onNavigate}
        productName="Example"
      />,
    )
    fireEvent.click(container.querySelector('.landing-nav-back')!)
    expect(onNavigate).toHaveBeenCalledWith('/docs', expect.anything())
    fireEvent.click(container.querySelector('.landing-btn-primary')!)
    expect(onNavigate).toHaveBeenCalledWith('/dl', expect.anything())
  })

  it('refreshes the status line from the GitHub releases API', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ published_at: '2026-10-24T00:00:00Z' }),
      }),
    )
    render(
      <LandingTemplate
        hero={{ title: 'Title' }}
        productName="Example"
        releaseApiUrl="https://api.github.com/repos/x/y/releases/latest"
        statusText="Last update: 9/24/26"
      />,
    )
    await waitFor(() => {
      expect(screen.getByText(/^Last update: 10\/2[34]/)).toBeTruthy()
    })
    vi.unstubAllGlobals()
  })
})
