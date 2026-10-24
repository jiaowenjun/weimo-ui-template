# Weimo UI Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![React 19](https://img.shields.io/badge/React-19-61dafb.svg)

**一个组件,给文档站装上完整的站点壳层。**

`weimo-ui-template` 为 Weimo UI 系列的文档站与独立预览站提供统一网页壳层:侧边栏、顶部栏、主题切换一次到位,你的站点只需专注写内容。Weimo UI 家族的每个站点外观一致、手感一致,用户在任何一个站里学会的导航方式,到下一个站依然适用。

**🔗 在线演示:<https://jiaowenjun.github.io/weimo-ui-template/>**

![浅色主题](docs/preview-light.png)

| 深色主题 | 窄屏抽屉 |
| :---: | :---: |
| ![深色主题](docs/preview-dark.png) | ![窄屏抽屉](docs/preview-drawer.png) |

## 它给你什么

- **响应式站点壳层** —— 宽屏常驻侧边栏,窄屏自动折叠为抽屉式侧边栏,无需自己处理断点。
- **三态主题管理** —— `light` / `dark` / `system` 一键循环切换,自动监听系统偏好变化并同步 `dark` class。
- **开箱即用的顶栏** —— 左侧菜单按钮与页面标题、右侧主题切换按钮,还可通过 `topBarActions` 挂载自己的操作。
- **路由无关** —— 不绑定 React Router。站点保留自己的路由、catalog 与 Vite 配置,只把当前页面和导航回调交给模板。
- **统一设计语言** —— 基于 [`weimo-ui-core`](https://github.com/jiaowenjun/weimo-ui-core) 的毛玻璃组件构建,与 Weimo UI 组件库视觉一致。
- **自动文档标题** —— `siteName` 与 `pageTitle` 自动拼装 `document.title`,也可按需关闭自行管理。

## 快速开始

### 1. 安装

```bash
pnpm add weimo-ui-template weimo-ui-core @base-ui/react
```

如需固定版本,请使用 npm 版本号:

```bash
pnpm add weimo-ui-template@0.1.1
```

### 2. 引入基础样式

站点负责选择 token 提供者,并在其后导入模板基础样式:

```css
@import "tailwindcss";
@import "weimo-ui-core/styles/tokens.css";
@import "weimo-ui-template/styles/base.css";
```

Markdown 站可以改为导入 `weimo-ui-markdown/styles/tokens.css`;该入口已包含 Core token。

### 3. 挂上 SiteTemplate

以 React Router 为例:

```tsx
import { Outlet, useMatch, useNavigate } from 'react-router'
import {
  SiteTemplate,
  type SiteNavigationGroup,
  type SiteNavigationItem,
} from 'weimo-ui-template/components/site-template'

const groups: SiteNavigationGroup[] = [
  {
    title: 'Components',
    items: [
      {
        id: 'tag-tree',
        label: 'TagTree',
        href: '/components/tag-tree',
      },
    ],
  },
]

export function DocsShell() {
  const navigate = useNavigate()
  const match = useMatch('/components/:componentId')
  const activeItemId = match?.params.componentId

  function openItem(item: SiteNavigationItem) {
    navigate(`/components/${encodeURIComponent(item.id)}`)
  }

  return (
    <SiteTemplate
      activeItemId={activeItemId}
      navigationGroups={groups}
      onNavigate={openItem}
      pageTitle="TagTree"
      siteName="weimo-ui-tagtree"
    >
      <Outlet />
    </SiteTemplate>
  )
}
```

导航项保留真实 `href`(可复制、可中键新开);提供 `onNavigate` 时,模板阻止整页跳转并把导航交给站点路由。

## SiteTemplate 常用 Props

| Prop | 说明 |
| --- | --- |
| `siteName` *(必填)* | 站点名,展示在侧边栏头部,并参与 `document.title` |
| `navigationGroups` *(必填)* | 侧边栏导航分组:分组标题 + 导航项(`id` / `label` / `href`) |
| `activeItemId` | 当前高亮的导航项 id |
| `onNavigate` | 导航项点击回调;提供后由站点路由接管跳转 |
| `pageTitle` | 顶栏与文档标题显示的当前页标题 |
| `defaultTheme` / `theme` / `onThemeChange` | 主题控制:非受控默认值,或受控模式 + 变更回调 |
| `topBarActions` | 顶栏右侧自定义内容 |
| `sidebarHeader` | 侧边栏头部自定义内容 |
| `manageDocumentTitle` | 是否自动维护 `document.title`,默认开启 |
| `scrollOnNavigate` | 导航后是否将内容区滚回顶部 |
| `contentClassName` / `contentProps` / `mainClassName` | 内容区扩展点 |

主题循环顺序为 `light → dark → system`,需要自行组合主题 UI 时,可从 `weimo-ui-template/components/site-template-model` 引入 `ThemeMode`、`getNextThemeMode` 等工具。单独渲染侧边栏可使用同入口导出的 `SiteNavigation`。

## LandingTemplate 页面模板

`LandingTemplate` 是**整页级**产品落地页模板:返回导航 + 居中 hero(多行标题 / 副标题 / CTA 按钮行 / 宽幅截图)+ 双栏 purpose 区(自适应画廊 + 文案与功能清单)+ 品牌页脚 + 法律行。与 `SiteTemplate` 的站壳不同,它渲染完整页面,适合独立路由(演示:`/examples/landing-template`)。

```tsx
import { LandingTemplate } from 'weimo-ui-template/components/landing-template'
import 'weimo-ui-template/styles/landing-template.css'

<LandingTemplate
  actions={[
    { href: '/download', iconSrc: '/apple.svg', label: 'Download for Mac', variant: 'primary' },
    { href: 'https://github.com/x/y', iconSrc: '/github.svg', label: 'View on GitHub', target: '_blank', variant: 'ghost' },
  ]}
  backHref="/"
  backLabel="Portfolio"
  flashImages={['/shot-1.png', '/shot-2.png', '/shot-3.png', '/shot-4.png']}
  hero={{ title: 'The Photoshop\nalternative for Mac', subtitle: 'Free, open source', imageSrc: '/hero.png' }}
  legal="Trademark disclaimer…"
  productName="MyApp"
  productIconSrc="/app-icon.png"
  purpose={{
    label: 'Purpose',
    heading: 'All the tools you need for\nprofessional work',
    paragraphs: ['…'],
    features: [{ iconSrc: '/ic-layer.png', label: 'Layers' }],
    gallery: ['/example-1.png', '/example-2.png', '/example-3.png'],
  }}
  releaseApiUrl="https://api.github.com/repos/x/y/releases/latest"
  statusText="Last update: 9/24/26"
/>
```

要点:

- **路由无关**:返回链接与按钮都是真实 `<a>`,提供 `onNavigate(href, event)` 供站点路由接管。
- **主题**:深色样式由任意祖先元素上的 `.dark` class 驱动(与 `SiteTemplate` 同一约定),模板自身不管理主题。
- **自适应画廊**:桌面端按裁切量在 3 / 4 图间选择(纯函数 `pickGalleryColumns` 从 `components/landing-template-model` 可测),移动端画廊自动变为无限横滚。
- **主按钮 hover 闪播**:`flashImages` 以 CSS 变量注入,悬停主按钮时逐帧闪现;不传则关闭。
- **状态行**:`statusText` 静态展示;传 `releaseApiUrl` 后自动抓取 GitHub 最新 release 日期替换。
- **字体**:默认字体栈含 Inter,但模板不加载网络字体;需要精确还原时由宿主自行引入(如 Google Fonts)。
- **全出血**:整页路由需要退出 `base.css` 为文档页准备的 `#root` 槽边,例如 `#root:has(.landing-template) { padding-inline: 0; }`。

## 页面内组件示例

模板不自带卡片组件,页面内的组件示例统一使用 `weimo-ui-core` 的标准预览卡:

```tsx
import { ComponentPreviewCard } from 'weimo-ui-core/components/component-preview-card'

<ComponentPreviewCard data-component-id="tag-tree" label="TagTree">
  <TagTree />
</ComponentPreviewCard>
```

需要自行组合标题、内容、页脚等卡片结构时,使用 `weimo-ui-core/components/base-card` 的 `BaseCard`。

## 本地跑起来

仓库内的 `site` 就是模板自身的文档与布局预览站,直接复用 `SiteTemplate`:

```bash
pnpm site:dev      # 开发,http://localhost:4179/weimo-ui-template/
pnpm site:build    # 构建
pnpm site:preview  # 预览构建产物
```

## 相关包

- [`weimo-ui-core`](https://github.com/jiaowenjun/weimo-ui-core) —— Weimo UI 基础组件与设计 token,本模板的构建基座

## 许可证

[MIT](LICENSE)
