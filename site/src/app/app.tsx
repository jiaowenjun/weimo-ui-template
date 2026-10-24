import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import { LayoutExamplePage } from '../docs/pages/layout-example-page'
import { DocsShell } from '../docs/shell/docs-shell'
import { examplePath, landingExamplePath, routerBasename } from '../docs/routes'
import { LandingTemplateDemo } from '../docs/examples/landing-template-demo'

function App() {
  return (
    <BrowserRouter basename={routerBasename || undefined}>
      <Routes>
        <Route element={<DocsShell />} path="/">
          <Route index element={<Navigate replace to={examplePath} />} />
          <Route element={<LayoutExamplePage />} path="examples/site-template" />
          <Route element={<Navigate replace to={examplePath} />} path="*" />
        </Route>
        {/* Landing pages are full-page templates, so the demo stands outside the docs shell */}
        <Route element={<LandingTemplateDemo />} path={landingExamplePath} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
