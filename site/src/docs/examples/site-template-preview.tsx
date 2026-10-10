import { useEffect, useState } from 'react'

import { ComponentPreviewCard } from 'weimo-ui-core/components/component-preview-card'
import { FrostedIconButton } from 'weimo-ui-core/components/frosted-icon-button'
import { FrostedLabel } from 'weimo-ui-core/components/frosted-label'
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from 'weimo-ui-template/components/card'
import {
  getNextThemeMode,
  getThemeToggleLabel,
  type ThemeMode,
} from 'weimo-ui-template/components/site-template-model'

import './site-template-preview.css'

type PreviewViewport = 'wide' | 'narrow'

const navigationItems = ['概览', '组件', '设计令牌']
const narrowViewportQuery = '(max-width: 699px)'
const systemThemeQuery = '(prefers-color-scheme: dark)'

function viewportIsNarrow() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(narrowViewportQuery).matches
  )
}

function systemThemeIsDark() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(systemThemeQuery).matches
  )
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4M18.7 18.7l-1.4-1.4M6.7 6.7 5.3 5.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M20.2 15.2A8.6 8.6 0 0 1 8.8 3.8a8.6 8.6 0 1 0 11.4 11.4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function MonitorIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        width="18"
        x="3"
        y="3"
      />
      <path
        d="M8 21h8M12 15v6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function ThemeIcon({ theme }: { theme: ThemeMode }) {
  switch (theme) {
    case 'light':
      return <SunIcon />
    case 'dark':
      return <MoonIcon />
    case 'system':
      return <MonitorIcon />
  }
}

function DemoNavigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="site-template-preview__navigation">
      <strong>示例站点</strong>
      <p>文档</p>
      <nav aria-label="示例导航">
        {navigationItems.map((item, index) => (
          <button
            className={index === 0 ? 'active' : undefined}
            key={item}
            onClick={onNavigate}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  )
}

function DemoContent() {
  return (
    <main className="site-template-preview__content">
      <Card>
        <CardHeader>
          <CardTitle>响应式站点壳层</CardTitle>
          <CardDescription>导航、标题栏与主题入口保持一致。</CardDescription>
        </CardHeader>
        <CardPanel>
          <span className="site-template-preview__placeholder site-template-preview__placeholder--long" />
          <span className="site-template-preview__placeholder" />
        </CardPanel>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>单列内容区</CardTitle>
          <CardDescription>页面内容按卡片顺序自然向下展开。</CardDescription>
        </CardHeader>
        <CardPanel>
          <span className="site-template-preview__placeholder site-template-preview__placeholder--long" />
          <span className="site-template-preview__placeholder site-template-preview__placeholder--short" />
        </CardPanel>
      </Card>
    </main>
  )
}

export function SiteTemplatePreview() {
  const [narrow, setNarrow] = useState(viewportIsNarrow)
  const [systemDark, setSystemDark] = useState(systemThemeIsDark)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>('system')
  const viewport: PreviewViewport = narrow ? 'narrow' : 'wide'
  const resolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    const mediaQuery = window.matchMedia(narrowViewportQuery)
    const syncViewport = () => {
      setNarrow(mediaQuery.matches)
      setDrawerOpen(false)
    }

    syncViewport()
    mediaQuery.addEventListener('change', syncViewport)
    return () => mediaQuery.removeEventListener('change', syncViewport)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia(systemThemeQuery)
    const syncSystemTheme = () => setSystemDark(mediaQuery.matches)

    syncSystemTheme()
    mediaQuery.addEventListener('change', syncSystemTheme)
    return () => mediaQuery.removeEventListener('change', syncSystemTheme)
  }, [])

  return (
    <ComponentPreviewCard
      data-component-id="site-template"
      label="SiteTemplate 布局示例"
    >
      <div
        className={`site-template-preview__viewport site-template-preview__viewport--${viewport}${resolvedTheme === 'dark' ? ' dark' : ''}`}
        data-preview-theme={resolvedTheme}
        data-preview-theme-mode={theme}
      >
        <div className="site-template-preview__workspace">
          {!narrow ? (
            <aside className="site-template-preview__sidebar">
              <DemoNavigation />
            </aside>
          ) : null}

          <div className="site-template-preview__page">
            <header className="site-template-preview__top-bar">
              <div>
                {narrow ? (
                  <FrostedIconButton
                    aria-expanded={drawerOpen}
                    aria-label="切换示例侧边栏"
                    className="site-template-preview__icon-button"
                    onClick={() => setDrawerOpen((open) => !open)}
                    size="sm"
                  >
                    <MenuIcon />
                  </FrostedIconButton>
                ) : null}
                <FrostedLabel className="site-template-preview__page-title">
                  页面标题
                </FrostedLabel>
              </div>
              <FrostedIconButton
                aria-label={`示例${getThemeToggleLabel(theme)}`}
                className="site-template-preview__theme-button"
                onClick={() =>
                  setTheme((currentTheme) => getNextThemeMode(currentTheme))
                }
                size="sm"
              >
                <ThemeIcon theme={theme} />
              </FrostedIconButton>
            </header>
            <DemoContent />
          </div>
        </div>

        {narrow && drawerOpen ? (
          <div
            className="site-template-preview__drawer-layer"
            onClick={() => setDrawerOpen(false)}
            role="presentation"
          >
            <aside
              aria-label="示例抽屉侧边栏"
              className="site-template-preview__drawer"
              onClick={(event) => event.stopPropagation()}
            >
              <DemoNavigation onNavigate={() => setDrawerOpen(false)} />
            </aside>
          </div>
        ) : null}
      </div>
    </ComponentPreviewCard>
  )
}
