import { Outlet } from 'react-router'

import { FrostedIconButton } from 'weimo-ui-core/components/frosted-icon-button'
import { MiniSiteTemplate } from 'weimo-ui-template/components/mini-site-template'

import { GitHubIcon } from '../github-icon'

const repoUrl = 'https://github.com/jiaowenjun/weimo-ui-template'

export function DocsShell() {
  return (
    <MiniSiteTemplate
      headline="网站模板，开箱即用"
      siteName="weimo-ui-template"
      subheadline="亮暗随行，宽窄自适应，克制极简"
      topBarActions={
        <FrostedIconButton
          aria-label="GitHub 仓库"
          onClick={() => window.open(repoUrl, '_blank', 'noopener,noreferrer')}
        >
          <GitHubIcon />
        </FrostedIconButton>
      }
    >
      <Outlet />
    </MiniSiteTemplate>
  )
}
