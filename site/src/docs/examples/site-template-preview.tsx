import { useState } from 'react'

import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from 'weimo-ui-template/components/card'

import './site-template-preview.css'

type PreviewViewport = 'wide' | 'narrow'

const navigationItems = ['概览', '组件', '设计令牌']

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
  const [viewport, setViewport] = useState<PreviewViewport>('wide')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const narrow = viewport === 'narrow'

  function selectViewport(nextViewport: PreviewViewport) {
    setViewport(nextViewport)
    setDrawerOpen(nextViewport === 'narrow')
  }

  return (
    <div className="site-template-preview">
      <div aria-label="预览视口" className="site-template-preview__controls">
        <button
          aria-pressed={!narrow}
          onClick={() => selectViewport('wide')}
          type="button"
        >
          宽屏
        </button>
        <button
          aria-pressed={narrow}
          onClick={() => selectViewport('narrow')}
          type="button"
        >
          窄屏
        </button>
      </div>

      <div
        className={`site-template-preview__viewport site-template-preview__viewport--${viewport}`}
      >
        {!narrow ? (
          <aside className="site-template-preview__sidebar">
            <DemoNavigation />
          </aside>
        ) : null}

        <div className="site-template-preview__page">
          <header className="site-template-preview__top-bar">
            <div>
              {narrow ? (
                <button
                  aria-expanded={drawerOpen}
                  aria-label="切换示例侧边栏"
                  className="site-template-preview__icon-button"
                  onClick={() => setDrawerOpen((open) => !open)}
                  type="button"
                >
                  <span />
                  <span />
                  <span />
                </button>
              ) : null}
              <strong>页面标题</strong>
            </div>
            <button
              aria-label="示例主题切换按钮"
              className="site-template-preview__theme-button"
              type="button"
            >
              ◐
            </button>
          </header>
          <DemoContent />
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
    </div>
  )
}
