import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  SiteTemplate,
  type SiteNavigationGroup,
} from '../src/components/site-template/site-template'

vi.mock('weimo-ui-core/components/frosted-icon-button', () => ({
  FrostedIconButton: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button type="button" {...props}>{children}</button>
  ),
}))

vi.mock('weimo-ui-core/components/frosted-label', () => ({
  FrostedLabel: ({ children, size: _size, ...props }: React.ComponentProps<'span'> & { size?: string }) => (
    <span {...props}>{children}</span>
  ),
}))

vi.mock('weimo-ui-core/components/sidebar', () => ({
  SideBar: ({ children, drawerAction, open }: { children?: React.ReactNode; drawerAction?: React.ReactNode; open?: boolean }) => (
    <aside data-open={String(open)}>
      {drawerAction}
      {children}
    </aside>
  ),
}))

vi.mock('weimo-ui-core/components/top-bar', () => ({
  TopBar: ({ leftSlot, rightSlot }: { leftSlot?: React.ReactNode; rightSlot?: React.ReactNode }) => (
    <header>
      {leftSlot}
      {rightSlot}
    </header>
  ),
}))

const navigationGroups: SiteNavigationGroup[] = [
  {
    title: 'Components',
    items: [
      { href: '/components/tag-tree', id: 'tag-tree', label: 'TagTree' },
      { href: '/components/tag-bread', id: 'tag-bread', label: 'TagBread' },
    ],
  },
]

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    }),
  })
  window.scrollTo = vi.fn()
})

describe('SiteTemplate', () => {
  it('renders navigation and delegates routing without depending on a router', () => {
    const onNavigate = vi.fn()

    render(
      <SiteTemplate
        activeItemId="tag-tree"
        navigationGroups={navigationGroups}
        onNavigate={onNavigate}
        pageTitle="TagTree"
        siteName="weimo-ui-tagtree"
      >
        <p>Content</p>
      </SiteTemplate>,
    )

    expect(screen.getByRole('link', { name: 'TagTree' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    fireEvent.click(screen.getByRole('link', { name: 'TagBread' }))
    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'tag-bread' }),
    )
    expect(window.scrollTo).toHaveBeenCalledWith({
      behavior: 'smooth',
      top: 0,
    })
  })

  it('manages the document title and theme cycle', async () => {
    render(
      <SiteTemplate
        navigationGroups={navigationGroups}
        pageTitle="TagTree"
        siteName="weimo-ui-tagtree"
      />,
    )

    await waitFor(() => {
      expect(document.title).toBe('TagTree - weimo-ui-tagtree')
    })

    const themeButton = screen.getByRole('button', { name: '切换到浅色主题' })
    fireEvent.click(themeButton)
    fireEvent.click(screen.getByRole('button', { name: '切换到深色主题' }))

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })

  it('opens and closes the narrow sidebar', () => {
    render(
      <SiteTemplate
        navigationGroups={navigationGroups}
        siteName="weimo-ui-tagtree"
      />,
    )

    const sidebar = screen.getByRole('complementary')
    expect(sidebar).toHaveAttribute('data-open', 'false')
    fireEvent.click(screen.getByRole('button', { name: '打开侧边栏' }))
    expect(sidebar).toHaveAttribute('data-open', 'true')
    fireEvent.click(screen.getByRole('button', { name: '关闭侧边栏' }))
    expect(sidebar).toHaveAttribute('data-open', 'false')
  })
})
