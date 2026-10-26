import { useState } from 'react'

import './preview-frame.css'

type PreviewFrameProps = {
  height?: number
  src: string
  title: string
  width: number
}

/** 通用 iframe 预览壳:iframe 拥有独立 viewport 与文档环境,
    宽度由外层控制,媒体查询与 matchMedia 均按 iframe 自身视口判定。 */
export function PreviewFrame({
  height = 430,
  src,
  title,
  width,
}: PreviewFrameProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="preview-frame" style={{ height }}>
      <div className="preview-frame__scroll">
        <iframe
          className={
            loaded
              ? 'preview-frame__iframe preview-frame__iframe--loaded'
              : 'preview-frame__iframe'
          }
          onLoad={() => setLoaded(true)}
          src={src}
          style={{ width }}
          title={title}
        />
      </div>
    </div>
  )
}
