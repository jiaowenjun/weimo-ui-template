import { useLayoutEffect, useRef, useState } from 'react'

import './follow-preview-frame.css'

type FollowPreviewFrameProps = {
  height?: number
  maxLayoutWidth: number
  onAvailableWidthChange?: (availableWidth: number) => void
  percent: number
  resizing?: boolean
  src: string
  title: string
}

/** 跟随预览壳:滑块是百分比视觉宽,预览区全程 1:1 跟随(与百分比视口
    卡片手感一致);iframe 布局宽按恒定倍率(100% 档 = maxLayoutWidth)
    派生,媒体查询与 699px 断点按布局宽真实判定,视觉宽永不超出容器、
    无横向滚动。 */
export function FollowPreviewFrame({
  height = 430,
  maxLayoutWidth,
  onAvailableWidthChange,
  percent,
  resizing = false,
  src,
  title,
}: FollowPreviewFrameProps) {
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

  const ratio = Math.min(percent, 100) / 100
  const visualWidth = (available || 0) * ratio
  // 恒定倍率:100% 档的布局宽为 maxLayoutWidth,其余按同一倍率派生
  const zoomFactor =
    available > 0 && available < maxLayoutWidth
      ? maxLayoutWidth / available
      : 1
  const layoutWidth = visualWidth * zoomFactor
  // 视觉高恒为 height,iframe 布局高按同一倍率放大,内部 100svh 随布局高取值
  const layoutHeight = height * zoomFactor
  const scale = 1 / zoomFactor

  return (
    <div
      className={
        resizing
          ? 'follow-preview-frame follow-preview-frame--resizing'
          : 'follow-preview-frame'
      }
      ref={containerRef}
      style={{ height }}
    >
      <div
        className="follow-preview-frame__stage"
        style={{ width: visualWidth }}
      >
        <iframe
          className={
            loaded
              ? 'follow-preview-frame__iframe follow-preview-frame__iframe--loaded'
              : 'follow-preview-frame__iframe'
          }
          onLoad={() => setLoaded(true)}
          src={src}
          style={{
            height: layoutHeight,
            transform: `scale(${scale})`,
            width: layoutWidth,
          }}
          title={title}
        />
      </div>
    </div>
  )
}
