import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const docsShell = await readFile(
  new URL('../site/src/docs/shell/docs-shell.tsx', import.meta.url),
  'utf8',
)
const layoutPage = await readFile(
  new URL('../site/src/docs/pages/layout-example-page.tsx', import.meta.url),
  'utf8',
)
const layoutPreview = await readFile(
  new URL('../site/src/docs/examples/site-template-preview.tsx', import.meta.url),
  'utf8',
)
const globalStyles = await readFile(
  new URL('../site/src/styles/global.css', import.meta.url),
  'utf8',
)
const mainEntry = await readFile(
  new URL('../site/src/main.tsx', import.meta.url),
  'utf8',
)
const sitePackage = JSON.parse(
  await readFile(new URL('../site/package.json', import.meta.url), 'utf8'),
)

assert.match(
  docsShell,
  /from 'weimo-ui-template\/components\/site-template'/,
  'the site shell must consume the public SiteTemplate API',
)
assert.match(
  layoutPage,
  /from 'weimo-ui-template\/components\/card'/,
  'the example page must consume the public preview card API',
)
assert.match(
  layoutPage,
  /<PreviewPage[\s\S]*<SiteTemplatePreview \/>[\s\S]*<\/PreviewPage>/,
  'the template layout example must stay inside PreviewPage',
)
assert.doesNotMatch(
  layoutPreview,
  /<SiteTemplate(?:\s|>)/,
  'the card preview must not mount a second viewport-level SiteTemplate',
)
assert.match(
  layoutPreview,
  /FrostedLabel/,
  'the card preview title must use the same frosted material as SiteTemplate',
)
assert.match(
  layoutPreview,
  /FrostedIconButton/,
  'the card preview controls must use the same frosted material as SiteTemplate',
)
assert.match(
  layoutPreview,
  /data-preview-theme=\{theme\}/,
  'the card preview must expose an isolated light and dark theme scope',
)
assert.match(
  layoutPreview,
  /setTheme\(\(currentTheme\) =>\s*currentTheme === 'light' \? 'dark' : 'light'/,
  'the card preview theme button must switch between light and dark themes',
)
assert.match(
  globalStyles,
  /@import "weimo-ui-template\/styles\/base\.css";/,
  'the site must consume the public template base stylesheet',
)
assert.ok(
  mainEntry.indexOf("import './styles/global.css'") <
    mainEntry.indexOf("import App from './app/app'"),
  'global styles must load before App so Tailwind establishes cascade layer order before component CSS',
)
assert.equal(
  sitePackage.dependencies['react-router'],
  '8.4.0',
  'the site must use the shared React Router version',
)
assert.equal(
  sitePackage.dependencies['weimo-ui-template'],
  'workspace:*',
  'the self-hosted site must consume the workspace package',
)
assert.equal(
  sitePackage.engines,
  undefined,
  'the site must not declare its own Node engine range',
)

console.log('site contract passed')
