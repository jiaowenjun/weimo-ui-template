import { Outlet, useMatch, useNavigate } from 'react-router'

import {
  SiteTemplate,
  type SiteNavigationGroup,
  type SiteNavigationItem,
} from 'weimo-ui-template/components/site-template'
import {
  exampleHref,
  examplePath,
  iframeExampleHref,
  iframeExamplePath,
  iframeFitExampleHref,
  iframeFitExamplePath,
  miniExampleHref,
  miniExamplePath,
} from '../routes'

const navigationGroups: SiteNavigationGroup[] = [
  {
    id: 'templates',
    title: '页面模板',
    items: [
      {
        id: 'site-template',
        href: exampleHref(),
        label: 'SiteTemplate',
      },
      {
        id: 'mini-site-template',
        href: miniExampleHref(),
        label: 'MiniSiteTemplate',
      },
    ],
  },
  {
    id: 'preview-compare',
    title: '预览方案对比',
    items: [
      {
        id: 'site-template-iframe',
        href: iframeExampleHref(),
        label: 'SiteTemplate · iframe',
      },
      {
        id: 'site-template-iframe-fit',
        href: iframeFitExampleHref(),
        label: 'SiteTemplate · iframe 缩放',
      },
    ],
  },
]

export function DocsShell() {
  const navigate = useNavigate()
  const layoutMatch = useMatch(examplePath)
  const iframeMatch = useMatch(iframeExamplePath)
  const iframeFitMatch = useMatch(iframeFitExamplePath)
  const activeItemId = layoutMatch
    ? 'site-template'
    : iframeMatch
      ? 'site-template-iframe'
      : iframeFitMatch
        ? 'site-template-iframe-fit'
        : undefined
  const openExample = (item: SiteNavigationItem) => {
    if (item.id === 'site-template') {
      navigate(examplePath)
    }
    if (item.id === 'mini-site-template') {
      navigate(miniExamplePath)
    }
    if (item.id === 'site-template-iframe') {
      navigate(iframeExamplePath)
    }
    if (item.id === 'site-template-iframe-fit') {
      navigate(iframeFitExamplePath)
    }
  }

  return (
    <SiteTemplate
      activeItemId={activeItemId}
      navigationGroups={navigationGroups}
      onNavigate={openExample}
      pageTitle="SiteTemplate"
      siteName="weimo-ui-template"
    >
      <Outlet />
    </SiteTemplate>
  )
}
