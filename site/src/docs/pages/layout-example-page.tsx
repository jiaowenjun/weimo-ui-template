import { PreviewPage } from 'weimo-ui-template/components/card'

import { SiteTemplatePreview } from '../examples/site-template-preview'

export function LayoutExamplePage() {
  return (
    <PreviewPage
      componentId="site-template"
      summary="切换视口示例，查看宽屏常驻侧边栏与窄屏抽屉布局。示例中的内容区始终保持单列卡片流。"
    >
      <SiteTemplatePreview />
    </PreviewPage>
  )
}
