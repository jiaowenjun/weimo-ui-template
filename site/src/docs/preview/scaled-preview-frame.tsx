import { useLayoutEffect, useRef, useState } from 'react'

import './scaled-preview-frame.css'

type ScaledPreviewFrameProps = {
  height?: number
  onAvailableWidthChange?: (availableWidth: number) => void
  resizing?: boolean
  src: string
  title: string
  width: number
}

/** 缩放预览壳:布局宽与视觉宽分离。
    iframe 布局宽度始终取 width(媒体查询与 699px 断点按它真实判定),
    超出容器可用宽时以 transform scale 等比缩放显示,视觉宽度封顶容器、
    永不产生横向滚动——与百分比视口卡片的滚动行为一致。 */
export function ScaledPreviewFrame({
  height = 430,
  onAvailableWidthChange,
  resizing = false,
  src,
  title,
  width,
}: ScaledPreviewFrameProps) {
  const [loaded, setLoaded] = useState(false)
  const [available, setAvailable] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  // 回调经 ref 持有,测量 effect 不因回调引用变化而重挂
  const onAvailableWidthChangeRef = useRef(onAvailableWidthChange)
  onAvailableWidthChangeRef.current = onAvailableWidthChange

  /* 可用宽只随容器与窗口尺寸变化:layout effect 里同步量测并监听 resize
     即可,不走 ResizeObserver——其回调依赖渲染帧,在部分嵌入浏览器环境
     里不会投递。 */
  useLayoutEffect(() => {
    const element = containerRef.current
    if (!element) return

    const syncAvailable = () => {
      setAvailable(element.clientWidth)
      onAvailableWidthChangeRef.current?.(element.clientWidth)
    }

    syncAvailable()
    window.addEventListener('resize', syncAvailable)
    return () => window.removeEventListener('resize', syncAvailable)
  }, [])

  const scale =
    available > 0 && width > available ? available / width : 1
  const displayWidth = Math.min(width, available || width)
  /* 视觉高恒为 height:iframe 布局高按比例放大,iframe 内 100svh
     随布局高取值,缩放后视觉高度稳定 */
  const iframeLayoutHeight = Math.ceil(height / scale)

  return (
    <div
      className={
        resizing
          ? 'scaled-preview-frame scaled-preview-frame--resizing'
          : 'scaled-preview-frame'
      }
      ref={containerRef}
      style={{ height }}
    >
      <div
        className="scaled-preview-frame__stage"
        style={{ width: displayWidth }}
      >
        <iframe
          className={
            loaded
              ? 'scaled-preview-frame__iframe scaled-preview-frame__iframe--loaded'
              : 'scaled-preview-frame__iframe'
          }
          onLoad={() => setLoaded(true)}
          src={src}
          style={{
            height: iframeLayoutHeight,
            transform: `scale(${scale})`,
            width,
          }}
          title={title}
        />
      </div>
    </div>
  )
}
