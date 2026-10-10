# weimo-ui-template

`weimo-ui-template` 为 Weimo UI 的文档站和独立预览站提供统一网页壳层：

- 宽屏常驻、窄屏抽屉式侧边栏
- 左侧菜单按钮和页面标题、右侧主题切换按钮的顶部栏
- 单列内容区与通用预览卡片
- `light`、`dark`、`system` 三态主题管理

模板不依赖 React Router。站点继续拥有自己的路由、catalog、组件示例和 Vite 配置，只把当前页面和导航回调交给模板。

## 示例站点

仓库内的 `site` 是模板自身的文档与布局预览站。站点外壳直接复用
`SiteTemplate`，并把宽屏常驻侧边栏、窄屏抽屉和单列卡片内容的布局示例
放在 `PreviewPage` 预览卡片内。

```bash
pnpm site:dev
pnpm site:build
pnpm site:preview
```

本地开发地址为 `http://localhost:4179/weimo-ui-template/`。

## 安装

```bash
pnpm add weimo-ui-template weimo-ui-core @base-ui/react
```

从 GitHub 提交安装时，请固定不可变 SHA：

```bash
pnpm add weimo-ui-template@github:jiaowenjun/weimo-ui-template#<commit-sha>
```

## 基础样式

站点负责选择 token 提供者，并在其后导入模板基础样式：

```css
@import "tailwindcss";
@import "weimo-ui-core/styles/tokens.css";
@import "weimo-ui-template/styles/base.css";
```

Markdown 站可以改为导入 `weimo-ui-markdown/styles/tokens.css`；该入口已包含 Core token。

## 接入路由

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

`topBarActions`、`sidebarHeader`、`contentClassName` 和 `contentProps` 用于站点级扩展。导航保留真实 `href`；提供 `onNavigate` 时，模板阻止整页跳转并把导航交给站点路由。

## 预览卡片

```tsx
import { PreviewPage } from 'weimo-ui-template/components/card'

<PreviewPage
  componentId="tag-tree"
  summary="树形标签选择组件"
>
  <TagTree />
</PreviewPage>
```

`PreviewPage` 的 `frame="plain"` 会直接渲染内容。更细粒度的页面可使用同一入口导出的 `Card`、`CardFrame`、`CardPanel` 及其插槽组件。

## 依赖边界

- 模板只使用 `weimo-ui-core` 的公开 package exports。
- 模板不查询或覆盖 Core 的内部 BEM 选择器。
- React、React DOM、Base UI 和 Core 为 peer dependency，由站点提供。
- 各站点的领域样式继续留在各自仓库，不进入模板。
