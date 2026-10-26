import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { LayoutExamplePage } from '../docs/pages/layout-example-page'
import { DocsShell } from '../docs/shell/docs-shell'
import { examplePath, miniExamplePath, routerBasename } from '../docs/routes'
import { MiniSiteTemplateDemo } from '../docs/examples/mini-site-template-demo'

function App() {
  return (
    <BrowserRouter basename={routerBasename || undefined}>
      <Routes>
        <Route element={<DocsShell />} path="/">
          <Route index element={<Navigate replace to={examplePath} />} />
          <Route element={<LayoutExamplePage />} path="examples/site-template" />
          <Route element={<Navigate replace to={examplePath} />} path="*" />
        </Route>
        {/* MiniSiteTemplate 自带顶栏,是整页站壳,演示页与文档壳平级独立渲染 */}
        <Route element={<MiniSiteTemplateDemo />} path={miniExamplePath} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
