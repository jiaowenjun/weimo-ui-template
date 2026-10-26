import { Outlet, useMatch, useNavigate } from 'react-router'

import {
  SiteTemplate,
  type SiteNavigationGroup,
  type SiteNavigationItem,
} from 'weimo-ui-template/components/site-template'
import {
  exampleHref,
  examplePath,
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
]

export function DocsShell() {
  const navigate = useNavigate()
  const layoutMatch = useMatch(examplePath)
  const miniMatch = useMatch(miniExamplePath)
  const openExample = (item: SiteNavigationItem) => {
    if (item.id === 'site-template') {
      navigate(examplePath)
    }
    if (item.id === 'mini-site-template') {
      navigate(miniExamplePath)
    }
  }

  return (
    <SiteTemplate
      activeItemId={
        layoutMatch
          ? 'site-template'
          : miniMatch
            ? 'mini-site-template'
            : undefined
      }
      navigationGroups={navigationGroups}
      onNavigate={openExample}
      pageTitle="SiteTemplate"
      siteName="weimo-ui-template"
    >
      <Outlet />
    </SiteTemplate>
  )
}
