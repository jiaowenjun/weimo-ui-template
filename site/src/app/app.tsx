import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { LayoutExamplePage } from '../docs/pages/layout-example-page'
import { DocsShell } from '../docs/shell/docs-shell'
import {
  examplePath,
  iframeFollowSolidExamplePath,
  miniExamplePath,
  routerBasename,
  siteTemplatePreviewPath,
} from '../docs/routes'
import { MiniSiteTemplateDemo } from '../docs/examples/mini-site-template-demo'
import { SiteTemplateIframeFollowSolidDemo } from '../docs/examples/site-template-iframe-follow-solid-demo'
import { SiteTemplatePreviewPage } from '../docs/previews/site-template-preview-page'

function App() {
  return (
    <BrowserRouter basename={routerBasename || undefined}>
      <Routes>
        <Route element={<DocsShell />} path="/">
          <Route index element={<Navigate replace to={examplePath} />} />
          <Route element={<LayoutExamplePage />} path="examples/site-template" />
          <Route
            element={<SiteTemplateIframeFollowSolidDemo />}
            path={iframeFollowSolidExamplePath}
          />
          <Route element={<Navigate replace to={examplePath} />} path="*" />
        </Route>
        {/* MiniSiteTemplate 自带顶栏,是整页站壳,演示页与文档壳平级独立渲染 */}
        <Route element={<MiniSiteTemplateDemo />} path={miniExamplePath} />
        {/* iframe 预览源页面:独立 document,不套文档壳,供 PreviewFrame 加载 */}
        <Route
          element={<SiteTemplatePreviewPage />}
          path={siteTemplatePreviewPath}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
