import { Outlet, useMatch, useNavigate } from 'react-router'

import {
  SiteTemplate,
  type SiteNavigationGroup,
  type SiteNavigationItem,
} from 'weimo-ui-template/components/site-template'
import { exampleHref, examplePath, landingExampleHref, landingExamplePath } from '../routes'

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
        id: 'landing-template',
        href: landingExampleHref(),
        label: 'LandingTemplate',
      },
    ],
  },
]

export function DocsShell() {
  const navigate = useNavigate()
  const layoutMatch = useMatch(examplePath)
  const openExample = (item: SiteNavigationItem) => {
    if (item.id === 'site-template') {
      navigate(examplePath)
    }
    if (item.id === 'landing-template') {
      navigate(landingExamplePath)
    }
  }

  return (
    <SiteTemplate
      activeItemId={layoutMatch ? 'site-template' : undefined}
      navigationGroups={navigationGroups}
      onNavigate={openExample}
      pageTitle="SiteTemplate"
      siteName="weimo-ui-template"
    >
      <Outlet />
    </SiteTemplate>
  )
}
