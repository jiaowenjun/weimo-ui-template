import { useLayoutEffect, useRef, useState } from 'react'

import './solid-follow-preview-frame.css'

type SolidFollowPreviewFrameProps = {
  height?: number
  maxLayoutWidth: number
  onAvailableWidthChange?: (availableWidth: number) => void
  percent: number
  resizing?: boolean
  src: string
  title: string
}

/** 实底跟随预览壳:与跟随壳同机制(百分比视觉宽 + 恒定倍率派生布局宽),
    差异在样式职责划分——测量外壳透明,黑色背景与圆角由宽度受控的
    stage 自持,预览区连同底色全程 1:1 跟随滑块(对齐百分比视口卡片的
    观感);外壳保持满宽承担测量,避免视觉宽反噬可用宽基准。
    缩放比例按 BASE_WIDTH 固定:卡片比基准宽时预览大小恒定(不随卡片
    放大,画面居中留白),比基准窄时单向降级为 fit 保证完整可见。 */

/* 固定缩放基准:100% 档视觉宽的上限,与演示卡内容最大宽度 token 对应
   (700px − 卡片 padding/边框 ≈ 672);卡片达上限时预览正好满卡 */
const BASE_WIDTH = 672
export function SolidFollowPreviewFrame({
  height = 430,
  maxLayoutWidth,
  onAvailableWidthChange,
  percent,
  resizing = false,
  src,
  title,
}: SolidFollowPreviewFrameProps) {
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
  /* 固定缩放:基准宽(100% 档视觉宽的上限)以下按可用宽 fit,以上锁定
     基准——宽卡下预览大小与 iframe 内部重排恒定,窄卡仍保证完整可见 */
  const fitWidth = Math.min(available > 0 ? available : BASE_WIDTH, BASE_WIDTH)
  const visualWidth = fitWidth * ratio
  const zoomFactor = maxLayoutWidth / fitWidth
  const layoutWidth = visualWidth * zoomFactor
  // 视觉高恒为 height,iframe 布局高按同一倍率放大,内部 100svh 随布局高取值
  const layoutHeight = height * zoomFactor
  const scale = 1 / zoomFactor

  return (
    <div
      className={
        resizing
          ? 'solid-follow-preview-frame solid-follow-preview-frame--resizing'
          : 'solid-follow-preview-frame'
      }
      ref={containerRef}
      style={{ height }}
    >
      <div
        className="solid-follow-preview-frame__stage"
        style={{ width: visualWidth }}
      >
        <iframe
          className={
            loaded
              ? 'solid-follow-preview-frame__iframe solid-follow-preview-frame__iframe--loaded'
              : 'solid-follow-preview-frame__iframe'
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
