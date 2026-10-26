import { useEffect, useState } from 'react'

import { ComponentPreviewCard } from 'weimo-ui-core/components/component-preview-card'
import { GhostIconButton } from 'weimo-ui-core/components/ghost-icon-button'
import { Slider } from 'weimo-ui-core/components/slider'

import { siteTemplatePreviewHref } from '../routes'
import { ScaledPreviewFrame } from '../preview/scaled-preview-frame'
import './site-template-iframe-fit-demo.css'

/* 断点值与 SideBar/site-template.css 的 (min-width: 700px) 媒体查询一致:
   iframe 布局宽度 ≥ 700px 走宽屏常驻侧栏,< 700px 切换为模态抽屉 */
const narrowBreakpoint = 700
const minPreviewWidth = 360
const maxPreviewWidth = 1100
const defaultPreviewWidth = 860

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

/** iframe 缩放预览:布局宽与视觉宽分离。滑块设定 iframe 布局宽度,
    断点按布局宽真实判定;超出卡片可用宽时整体等比缩放显示,
    预览区封顶容器、无横向滚动——滚动行为与百分比视口卡片一致。 */
export function SiteTemplateIframeFitDemo() {
  const [width, setWidth] = useState(defaultPreviewWidth)
  const [resizing, setResizing] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const layoutLabel = width >= narrowBreakpoint ? '宽屏' : '窄屏'
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

  const scale =
    containerWidth > 0 && width > containerWidth
      ? containerWidth / width
      : 1
  const scaleLabel = scale < 1 ? `缩放 ${Math.round(scale * 100)}%` : '1:1'

  function openPreviewInNewWindow() {
    window.open(previewHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <ComponentPreviewCard
      data-component-id="site-template-iframe-fit"
      footer={
        <div className="site-template-iframe-fit-demo__width-bar">
          <div
            className="site-template-iframe-fit-demo__width-slider"
            onPointerDown={() => setResizing(true)}
          >
            <Slider
              ariaLabel="调整预览布局宽度"
              max={maxPreviewWidth}
              min={minPreviewWidth}
              onValueChange={setWidth}
              value={width}
            />
          </div>
          <span className="site-template-iframe-fit-demo__width-readout">
            {Math.round(width)}px · {layoutLabel} · {scaleLabel}
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
            aria-label="重置预览布局宽度"
            onClick={() => setWidth(defaultPreviewWidth)}
            size="sm"
            type="button"
          >
            <ResetIcon />
          </GhostIconButton>
        </div>
      }
      label="SiteTemplate · iframe 缩放预览"
    >
      <p className="site-template-iframe-fit-demo__description">
        滑块设定 iframe 的布局宽度,699px 断点按它真实判定;超出卡片可用宽时
        预览整体等比缩放,视觉宽度封顶容器、不产生横向滚动,与百分比视口
        卡片的滚动行为一致。
      </p>
      <ScaledPreviewFrame
        onAvailableWidthChange={setContainerWidth}
        resizing={resizing}
        src={previewHref}
        title="SiteTemplate 缩放实时预览"
        width={width}
      />
    </ComponentPreviewCard>
  )
}
