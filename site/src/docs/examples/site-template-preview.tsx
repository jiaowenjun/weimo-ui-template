import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { ComponentPreviewCard } from 'weimo-ui-core/components/component-preview-card'
import { FrostedIconButton } from 'weimo-ui-core/components/frosted-icon-button'
import { FrostedLabel } from 'weimo-ui-core/components/frosted-label'
import { GhostIconButton } from 'weimo-ui-core/components/ghost-icon-button'
import { Slider } from 'weimo-ui-core/components/slider'
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
const minContentWidth = 30
const maxContentWidth = 100
/* 预览按约 0.55 的比例缩放了真实布局（侧栏 148px 对 290px），700px 断点同比例
   折算：视口自身宽度低于该值即进入窄屏布局，滑块收窄内容区就能观察侧栏
   折叠为抽屉的响应式切换。 */
const previewNarrowWidth = 420

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

function ResetIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M3 3v5h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
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
      <ComponentPreviewCard label="响应式站点壳层">
        <p className="site-template-preview__card-description">
          导航、标题栏与主题入口保持一致。
        </p>
        <span className="site-template-preview__placeholder site-template-preview__placeholder--long" />
        <span className="site-template-preview__placeholder" />
      </ComponentPreviewCard>

      <ComponentPreviewCard label="单列内容区">
        <p className="site-template-preview__card-description">
          页面内容按卡片顺序自然向下展开。
        </p>
        <span className="site-template-preview__placeholder site-template-preview__placeholder--long" />
        <span className="site-template-preview__placeholder site-template-preview__placeholder--short" />
      </ComponentPreviewCard>
    </main>
  )
}

export function SiteTemplatePreview() {
  const [windowNarrow, setWindowNarrow] = useState(viewportIsNarrow)
  const [previewNarrow, setPreviewNarrow] = useState(false)
  const [contentWidth, setContentWidth] = useState(maxContentWidth)
  const [resizing, setResizing] = useState(false)
  const [systemDark, setSystemDark] = useState(systemThemeIsDark)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>('system')
  const viewportRef = useRef<HTMLDivElement>(null)
  const narrow = windowNarrow || previewNarrow
  const viewport: PreviewViewport = narrow ? 'narrow' : 'wide'
  const resolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    const mediaQuery = window.matchMedia(narrowViewportQuery)
    const syncViewport = () => {
      setWindowNarrow(mediaQuery.matches)
      setDrawerOpen(false)
    }

    syncViewport()
    mediaQuery.addEventListener('change', syncViewport)
    return () => mediaQuery.removeEventListener('change', syncViewport)
  }, [])

  /* 预览视口宽度只随滑块与窗口尺寸变化：在 layout effect 里按目标宽度同步
     判定并监听 resize 即可覆盖，不走 ResizeObserver——其回调依赖渲染帧，
     在部分嵌入浏览器环境里不会投递。判定必须用与内联样式同公式的目标宽度：
     重置归位带宽度过渡，commit 时量测实时 offsetWidth 读到的仍是旧值。 */
  useLayoutEffect(() => {
    const element = viewportRef.current
    if (!element) return

    const syncPreviewNarrow = () => {
      const available =
        element.parentElement?.clientWidth ?? element.offsetWidth
      const targetWidth = Math.min(
        (available * contentWidth) / 100,
        windowNarrow ? 320 : Number.POSITIVE_INFINITY,
      )

      setPreviewNarrow(targetWidth < previewNarrowWidth)
    }

    syncPreviewNarrow()
    window.addEventListener('resize', syncPreviewNarrow)
    return () => window.removeEventListener('resize', syncPreviewNarrow)
  }, [contentWidth, windowNarrow])

  // 拖动期间禁用视口的宽度过渡保证逐帧跟手；监听挂在 window 上，
  // 指针拖出滑块范围后松手也能恢复过渡（重置按钮的归位动画依赖它）。
  useEffect(() => {
    if (!resizing) return

    const stopResizing = () => setResizing(false)
    window.addEventListener('pointerup', stopResizing)
    window.addEventListener('pointercancel', stopResizing)
    return () => {
      window.removeEventListener('pointerup', stopResizing)
      window.removeEventListener('pointercancel', stopResizing)
    }
  }, [resizing])

  useEffect(() => {
    const mediaQuery = window.matchMedia(systemThemeQuery)
    const syncSystemTheme = () => setSystemDark(mediaQuery.matches)

    syncSystemTheme()
    mediaQuery.addEventListener('change', syncSystemTheme)
    return () => mediaQuery.removeEventListener('change', syncSystemTheme)
  }, [])

  function resetContentWidth() {
    setContentWidth(maxContentWidth)
  }

  const viewportClassName = [
    'site-template-preview__viewport',
    `site-template-preview__viewport--${viewport}`,
    resolvedTheme === 'dark' ? 'dark' : undefined,
    resizing ? 'site-template-preview__viewport--resizing' : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <ComponentPreviewCard
      data-component-id="site-template"
      footer={
        <div className="site-template-preview__width-bar">
          <div
            className="site-template-preview__width-slider"
            onPointerDown={() => setResizing(true)}
          >
            <Slider
              ariaLabel="调整示例内容区宽度"
              max={maxContentWidth}
              min={minContentWidth}
              onValueChange={setContentWidth}
              value={contentWidth}
            />
          </div>
          <GhostIconButton
            aria-label="重置示例内容区宽度"
            onClick={resetContentWidth}
            size="sm"
            type="button"
          >
            <ResetIcon />
          </GhostIconButton>
        </div>
      }
      label="SiteTemplate 布局示例"
    >
      <div
        className={viewportClassName}
        data-preview-theme={resolvedTheme}
        data-preview-theme-mode={theme}
        ref={viewportRef}
        style={{
          width: windowNarrow
            ? `min(${contentWidth}%, 320px)`
            : `${contentWidth}%`,
        }}
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
