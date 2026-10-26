import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { LabeledSwitch } from 'weimo-ui-core/components/labeled-switch'

/*
 * 站点 DEBUG 开关(仅 site):经 portal 挂到站壳 main 内容末尾,
 * 位于内容列 __content 之外,不受内容宽度约束;
 * 开启后给站壳顶层部件(顶栏/hero/内容卡)画 outline,样式见同目录 css。
 */
export function DebugOutlineToggle() {
  const [checked, setChecked] = useState(false)
  const [host, setHost] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setHost(document.querySelector('main.weimo-mini-site-template'))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('debug-outline', checked)
    return () => {
      document.documentElement.classList.remove('debug-outline')
    }
  }, [checked])

  if (!host) {
    return null
  }

  return createPortal(
    <div className="debug-outline-toggle">
      <LabeledSwitch
        ariaLabel="显示页面顶层部件轮廓"
        checked={checked}
        labelOff="DEBUG 关"
        labelOn="DEBUG 开"
        onCheckedChange={setChecked}
      />
    </div>,
    host,
  )
}
