import { useEffect, useState } from 'react'

import { ComponentPreviewCard } from 'weimo-ui-core/components/component-preview-card'
import { GhostIconButton } from 'weimo-ui-core/components/ghost-icon-button'
import { Slider } from 'weimo-ui-core/components/slider'

import { siteTemplatePreviewHref } from '../routes'
import { FollowPreviewFrame } from '../preview/follow-preview-frame'
import './site-template-iframe-follow-demo.css'

/* 断点值与 SideBar/site-template.css 的 (min-width: 700px) 媒体查询一致:
   iframe 布局宽度 ≥ 700px 走宽屏常驻侧栏,< 700px 切换为模态抽屉 */
const narrowBreakpoint = 700
const minPercent = 30
const maxPercent = 100
/* 100% 档对应的 iframe 布局宽度;断点落在滑块约 63.6%(700/1100)处 */
const maxLayoutWidth = 1100
const defaultPercent = 78

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

function OpenInNewIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M14 4h6v6M20 4l-8.5 8.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M19 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}

/** iframe 跟随预览:滑块是百分比视觉宽,预览区全程 1:1 跟随滑块,
    与百分比视口卡片的手感一致;iframe 布局宽按恒定倍率派生,
    699px 断点按布局宽真实判定(滑块约 63.6% 处切换)。 */
export function SiteTemplateIframeFollowDemo() {
  const [percent, setPercent] = useState(defaultPercent)
  const [resizing, setResizing] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const previewHref = siteTemplatePreviewHref()

  // 拖动期间禁用预览区过渡保证逐帧跟手,松手恢复(重置归位动画依赖它)
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

  const layoutWidth = Math.round((percent / 100) * maxLayoutWidth)
  const visualWidth = Math.round((percent / 100) * containerWidth)
  const layoutLabel = layoutWidth >= narrowBreakpoint ? '宽屏' : '窄屏'
  const scalePercent =
    containerWidth > 0
      ? Math.round(Math.min(containerWidth / maxLayoutWidth, 1) * 100)
      : 100

  function openPreviewInNewWindow() {
    window.open(previewHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <ComponentPreviewCard
      data-component-id="site-template-iframe-follow"
      footer={
        <div className="site-template-iframe-follow-demo__width-bar">
          <div
            className="site-template-iframe-follow-demo__width-slider"
            onPointerDown={() => setResizing(true)}
          >
            <Slider
              ariaLabel="调整预览宽度百分比"
              max={maxPercent}
              min={minPercent}
              onValueChange={setPercent}
              value={percent}
            />
          </div>
          <span className="site-template-iframe-follow-demo__width-readout">
            {percent}% · 布局 {layoutWidth}px · 视觉 {visualWidth}px ·{' '}
            {layoutLabel} · 缩放 {scalePercent}%
          </span>
          <GhostIconButton
            aria-label="在新窗口打开预览页"
            onClick={openPreviewInNewWindow}
            size="sm"
            type="button"
          >
            <OpenInNewIcon />
          </GhostIconButton>
          <GhostIconButton
            aria-label="重置预览宽度百分比"
            onClick={() => setPercent(defaultPercent)}
            size="sm"
            type="button"
          >
            <ResetIcon />
          </GhostIconButton>
        </div>
      }
      label="SiteTemplate · iframe 跟随预览"
    >
      <p className="site-template-iframe-follow-demo__description">
        滑块是百分比视觉宽,预览区全程 1:1 跟随,与百分比视口卡片手感一致;
        iframe 布局宽按恒定倍率(100% 档 = 1100px)派生,699px 断点按布局宽
        真实判定,拖过约 64% 即见侧栏折叠为模态抽屉。
      </p>
      <FollowPreviewFrame
        maxLayoutWidth={maxLayoutWidth}
        onAvailableWidthChange={setContainerWidth}
        percent={percent}
        resizing={resizing}
        src={previewHref}
        title="SiteTemplate 跟随实时预览"
      />
    </ComponentPreviewCard>
  )
}
