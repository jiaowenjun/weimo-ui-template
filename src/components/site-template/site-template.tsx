import {
  useCallback,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Menu, Monitor, Moon, Sun, X } from 'lucide-react'

import { FrostedIconButton } from 'weimo-ui-core/components/frosted-icon-button'
import { FrostedLabel } from 'weimo-ui-core/components/frosted-label'
import { SideBar } from 'weimo-ui-core/components/sidebar'
import { TopBar } from 'weimo-ui-core/components/top-bar'
import { cn } from 'weimo-ui-core/lib/utils'

import {
  getNextThemeMode,
  getSiteDocumentTitle,
  getThemeToggleLabel,
  type ThemeMode,
} from './site-template-model'
import './site-template.css'

export type SiteNavigationItem = {
  href: string
  id: string
  label: string
}

export type SiteNavigationGroup = {
  id?: string
  items: readonly SiteNavigationItem[]
  title: string
}

export type SiteNavigationProps = {
  activeItemId?: string
  groups: readonly SiteNavigationGroup[]
  header?: ReactNode
  onNavigate?: (item: SiteNavigationItem) => void
}

export type SiteTemplateProps = {
  activeItemId?: string
  children?: ReactNode
  contentClassName?: string
  contentProps?: Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className'>
  defaultTheme?: ThemeMode
  mainClassName?: string
  manageDocumentTitle?: boolean
  navigationGroups: readonly SiteNavigationGroup[]
  onNavigate?: (item: SiteNavigationItem) => void
  onThemeChange?: (theme: ThemeMode) => void
  pageTitle?: string
  scrollOnNavigate?: boolean
  sidebarAriaLabel?: string
  sidebarHeader?: ReactNode
  siteName: string
  theme?: ThemeMode
  topBarActions?: ReactNode
}

function ThemeIcon({ theme }: { theme: ThemeMode }) {
  switch (theme) {
    case 'light':
      return <Sun />
    case 'dark':
      return <Moon />
    case 'system':
      return <Monitor />
  }
}

function useTheme({
  defaultTheme,
  onThemeChange,
  theme: controlledTheme,
}: {
  defaultTheme: ThemeMode
  onThemeChange?: (theme: ThemeMode) => void
  theme?: ThemeMode
}) {
  const [internalTheme, setInternalTheme] = useState(defaultTheme)
  const theme = controlledTheme ?? internalTheme

  useEffect(() => {
    if (theme !== 'system') {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystemTheme = () => {
      document.documentElement.classList.toggle('dark', mediaQuery.matches)
    }

    syncSystemTheme()
    mediaQuery.addEventListener('change', syncSystemTheme)

    return () => mediaQuery.removeEventListener('change', syncSystemTheme)
  }, [theme])

  const cycleTheme = useCallback(() => {
    const nextTheme = getNextThemeMode(theme)

    if (controlledTheme === undefined) {
      setInternalTheme(nextTheme)
    }

    onThemeChange?.(nextTheme)
  }, [controlledTheme, onThemeChange, theme])

  return { cycleTheme, theme }
}

export function SiteNavigation({
  activeItemId,
  groups,
  header,
  onNavigate,
}: SiteNavigationProps) {
  function handleClick(
    event: MouseEvent<HTMLAnchorElement>,
    item: SiteNavigationItem,
  ) {
    if (!onNavigate) return

    event.preventDefault()
    onNavigate(item)
  }

  return (
    <div className="weimo-site-template__navigation" data-base-ui-swipe-ignore>
      <div className="weimo-site-template__navigation-header">{header}</div>

      {groups.map((group) => (
        <nav
          aria-label={group.title}
          className="weimo-site-template__navigation-group"
          key={group.id ?? group.title}
        >
          <p>{group.title}</p>
          {group.items.map((item) => {
            const active = item.id === activeItemId

            return (
              <a
                aria-current={active ? 'page' : undefined}
                className={active ? 'active' : undefined}
                href={item.href}
                key={item.id}
                onClick={(event) => handleClick(event, item)}
              >
                <span>{item.label}</span>
              </a>
            )
          })}
        </nav>
      ))}
    </div>
  )
}

export function SiteTemplate({
  activeItemId,
  children,
  contentClassName,
  contentProps,
  defaultTheme = 'system',
  mainClassName,
  manageDocumentTitle = true,
  navigationGroups,
  onNavigate,
  onThemeChange,
  pageTitle,
  scrollOnNavigate = true,
  sidebarAriaLabel = '侧边栏',
  sidebarHeader,
  siteName,
  theme: controlledTheme,
  topBarActions,
}: SiteTemplateProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { cycleTheme, theme } = useTheme({
    defaultTheme,
    onThemeChange,
    theme: controlledTheme,
  })
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  useEffect(() => {
    if (manageDocumentTitle) {
      document.title = getSiteDocumentTitle(siteName, pageTitle)
    }
  }, [manageDocumentTitle, pageTitle, siteName])

  const handleNavigate = useCallback(
    (item: SiteNavigationItem) => {
      onNavigate?.(item)
      closeSidebar()

      if (scrollOnNavigate) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [closeSidebar, onNavigate, scrollOnNavigate],
  )

  const navigationHeader = sidebarHeader ?? <strong>{siteName}</strong>
  const leftSlot = (
    <div className="weimo-site-template__top-bar-slot">
      <FrostedIconButton
        aria-label="打开侧边栏"
        className="weimo-site-template__sidebar-trigger"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </FrostedIconButton>
      {pageTitle ? (
        <FrostedLabel
          className="weimo-site-template__page-title"
          key={pageTitle}
          size="lg"
        >
          {pageTitle}
        </FrostedLabel>
      ) : null}
    </div>
  )
  const rightSlot = (
    <div className="weimo-site-template__top-bar-slot">
      {topBarActions}
      <FrostedIconButton
        aria-label={getThemeToggleLabel(theme)}
        onClick={cycleTheme}
      >
        <ThemeIcon theme={theme} />
      </FrostedIconButton>
    </div>
  )

  return (
    <>
      <SideBar
        ariaLabel={sidebarAriaLabel}
        className="weimo-site-template__sidebar"
        drawerAction={
          <FrostedIconButton aria-label="关闭侧边栏" onClick={closeSidebar}>
            <X />
          </FrostedIconButton>
        }
        open={sidebarOpen}
        onClose={closeSidebar}
      >
        <SiteNavigation
          activeItemId={activeItemId}
          groups={navigationGroups}
          header={navigationHeader}
          onNavigate={onNavigate ? handleNavigate : undefined}
        />
      </SideBar>
      <TopBar leftSlot={leftSlot} rightSlot={rightSlot} />

      <main className={cn('weimo-site-template', mainClassName)}>
        <div className="weimo-site-template__layout">
          <div
            aria-hidden="true"
            className="weimo-site-template__sidebar-space"
          />
          <div
            {...contentProps}
            className={cn(
              'weimo-site-template__content',
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
      </main>
    </>
  )
}

export type { ThemeMode } from './site-template-model'
