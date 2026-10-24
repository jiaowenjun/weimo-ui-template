import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const shellSource = await readFile(
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
const siteHtml = await readFile(
  new URL('../site/index.html', import.meta.url),
  'utf8',
)
const sitePackage = JSON.parse(
  await readFile(new URL('../site/package.json', import.meta.url), 'utf8'),
)

assert.match(
  shellSource,
  /from 'weimo-ui-template\/components\/site-template'/,
  'the site shell must consume the public SiteTemplate API',
)
assert.match(
  layoutPage,
  /return <SiteTemplatePreview \/>/,
  'the example page must render the layout preview directly',
)
assert.match(
  layoutPreview,
  /from 'weimo-ui-core\/components\/component-preview-card'/,
  'the layout example must use the standard ComponentPreviewCard',
)
assert.match(
  layoutPreview,
  /<ComponentPreviewCard[\s\S]*label="SiteTemplate 布局示例"/,
  'the preview card header must show its title',
)
assert.doesNotMatch(
  layoutPreview,
  /LabeledSwitch|切换预览视口宽度|labelOff="宽屏"|labelOn="窄屏"/,
  'the preview card must not expose a manual wide/narrow Switch',
)
assert.match(
  layoutPreview,
  /const narrowViewportQuery = '\(max-width: 699px\)'/,
  'the preview must use the inverse of the SiteTemplate 700px breakpoint',
)
assert.match(
  layoutPreview,
  /window\.matchMedia\(narrowViewportQuery\)[\s\S]*addEventListener\('change', syncViewport\)/,
  'the preview must react to real viewport width changes',
)
assert.match(
  layoutPreview,
  /from 'weimo-ui-core\/components\/slider'/,
  'the content width control must use the core Slider',
)
assert.match(
  layoutPreview,
  /footer=\{[\s\S]*ariaLabel="调整示例内容区宽度"/,
  'the preview card footer must host the content width slider',
)
assert.match(
  layoutPreview,
  /aria-label="重置示例内容区宽度"[\s\S]*onClick=\{resetContentWidth\}/,
  'the footer reset button must restore the default content width',
)
assert.match(
  layoutPreview,
  /addEventListener\('resize', syncPreviewNarrow\)/,
  'the preview must reflow to the narrow layout from its own element width',
)
assert.doesNotMatch(
  layoutPreview,
  /site-template-preview__controls/,
  'the wide/narrow control must not remain inside the preview canvas',
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
  /from 'weimo-ui-template\/components\/site-template-model'/,
  'the card preview must share the SiteTemplate theme cycle model',
)
assert.match(
  layoutPreview,
  /useState<ThemeMode>\('system'\)/,
  'the card preview must default to the system theme mode',
)
assert.match(
  layoutPreview,
  /const systemThemeQuery = '\(prefers-color-scheme: dark\)'[\s\S]*addEventListener\('change', syncSystemTheme\)/,
  'the system theme mode must react to OS theme changes',
)
assert.match(
  layoutPreview,
  /data-preview-theme=\{resolvedTheme\}[\s\S]*data-preview-theme-mode=\{theme\}/,
  'the card preview must expose both its resolved and selected theme modes',
)
assert.match(
  layoutPreview,
  /setTheme\(\(currentTheme\) => getNextThemeMode\(currentTheme\)\)/,
  'the card preview theme button must cycle through the shared theme modes',
)
assert.match(
  layoutPreview,
  /case 'system':[\s\S]*<MonitorIcon \/>/,
  'the card preview must show a monitor icon for the system theme mode',
)
assert.match(
  globalStyles,
  /@import "weimo-ui-template\/styles\/base\.css";/,
  'the site must consume the public template base stylesheet',
)
assert.match(
  siteHtml,
  /html\s*{[^}]*background-color:\s*hsl\(40 16% 96%\);[^}]*}/s,
  'the document must provide the light page background before site CSS loads',
)
assert.match(
  siteHtml,
  /html\.dark\s*{[^}]*background-color:\s*hsl\(0 0% 7%\);[^}]*color-scheme:\s*dark;[^}]*}/s,
  'the document must provide the dark page background before site CSS loads',
)
assert.match(
  siteHtml,
  /document\.documentElement\.classList\.toggle\(\s*'dark',\s*window\.matchMedia\('\(prefers-color-scheme: dark\)'\)\.matches,?\s*\)/s,
  'the document must resolve the system theme before React mounts',
)
assert.ok(
  siteHtml.indexOf("window.matchMedia('(prefers-color-scheme: dark)')") <
    siteHtml.indexOf('<script type="module" src="./src/main.tsx"></script>'),
  'theme initialization must run before the application module',
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

const landingDemo = await readFile(
  new URL('../site/src/docs/examples/landing-template-demo.tsx', import.meta.url),
  'utf8',
)

assert.match(
  landingDemo,
  /from 'weimo-ui-template\/components\/landing-template'/,
  'the landing demo must consume the public LandingTemplate API',
)
assert.match(
  landingDemo,
  /<LandingTemplate\b/,
  'the landing demo must render the LandingTemplate directly',
)
assert.match(
  shellSource,
  /id: 'landing-template'/,
  'the docs shell must link to the landing demo',
)

console.log('site contract passed')
