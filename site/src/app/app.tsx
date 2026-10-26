import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { LayoutExamplePage } from '../docs/pages/layout-example-page'
import { DocsShell } from '../docs/shell/docs-shell'
import {
  examplePath,
  miniExamplePath,
  miniSiteTemplatePreviewPath,
  routerBasename,
  siteTemplatePreviewPath,
} from '../docs/routes'
import { MiniSiteTemplateDemo } from '../docs/examples/mini-site-template-demo'
import { MiniSiteTemplatePreviewPage } from '../docs/previews/mini-site-template-preview-page'
import { SiteTemplatePreviewPage } from '../docs/previews/site-template-preview-page'

function App() {
  return (
    <BrowserRouter basename={routerBasename || undefined}>
      <Routes>
        <Route element={<DocsShell />} path="/">
          <Route index element={<Navigate replace to={examplePath} />} />
          <Route element={<LayoutExamplePage />} path="examples/site-template" />
          <Route element={<MiniSiteTemplateDemo />} path={miniExamplePath} />
          <Route element={<Navigate replace to={examplePath} />} path="*" />
        </Route>
        {/* iframe 预览源页面:独立 document,不套文档壳,供缩放预览壳加载 */}
        <Route
          element={<SiteTemplatePreviewPage />}
          path={siteTemplatePreviewPath}
        />
        <Route
          element={<MiniSiteTemplatePreviewPage />}
          path={miniSiteTemplatePreviewPath}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
