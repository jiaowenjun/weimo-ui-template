import { useState } from 'react'

import { ComponentPreviewCard } from 'weimo-ui-core/components/component-preview-card'
import { GhostIconButton } from 'weimo-ui-core/components/ghost-icon-button'
import { Slider } from 'weimo-ui-core/components/slider'

import { siteTemplatePreviewHref } from '../routes'
import { PreviewFrame } from '../preview/preview-frame'
import './site-template-iframe-demo.css'

/* 断点值与 SideBar/site-template.css 的 (min-width: 700px) 媒体查询一致:
   iframe 宽度 ≥ 700px 走宽屏常驻侧栏,< 700px 切换为模态抽屉 */
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

/** 方案一:独立预览路由 + iframe。滑块改的是 iframe 宽度,
    真实组件的媒体查询与 matchMedia 按该视口原样生效。 */
export function SiteTemplateIframeDemo() {
  const [width, setWidth] = useState(defaultPreviewWidth)
  const layoutLabel = width >= narrowBreakpoint ? '宽屏' : '窄屏'
  const previewHref = siteTemplatePreviewHref()

  function openPreviewInNewWindow() {
    window.open(previewHref, '_blank', 'noopener,noreferrer')
  }

  return (
    <ComponentPreviewCard
      data-component-id="site-template-iframe"
      footer={
        <div className="site-template-iframe-demo__width-bar">
          <div className="site-template-iframe-demo__width-slider">
            <Slider
              ariaLabel="调整预览视口宽度"
              max={maxPreviewWidth}
              min={minPreviewWidth}
              onValueChange={setWidth}
              value={width}
            />
          </div>
          <span className="site-template-iframe-demo__width-readout">
            {Math.round(width)}px · {layoutLabel}
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
            aria-label="重置预览视口宽度"
            onClick={() => setWidth(defaultPreviewWidth)}
            size="sm"
            type="button"
          >
            <ResetIcon />
          </GhostIconButton>
        </div>
      }
      label="SiteTemplate · iframe 预览"
    >
      <p className="site-template-iframe-demo__description">
        iframe 加载独立预览路由,生产 SiteTemplate 运行在自己的文档环境里:
        主题、fixed 定位与弹出层都被隔离在预览视口内,拖动滑块跨越 699px
        即触发真实的宽窄屏切换。
      </p>
      <PreviewFrame
        src={previewHref}
        title="SiteTemplate 实时预览"
        width={width}
      />
    </ComponentPreviewCard>
  )
}
