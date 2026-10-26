import { Outlet } from 'react-router'

import { FrostedIconButton } from 'weimo-ui-core/components/frosted-icon-button'
import { MiniSiteTemplate } from 'weimo-ui-template/components/mini-site-template'

import { GitHubIcon } from '../github-icon'

const repoUrl = 'https://github.com/jiaowenjun/weimo-ui-template'

export function DocsShell() {
  return (
    <MiniSiteTemplate
      headline="weimo-ui-template"
      siteName="weimo-ui-template"
      subheadline="站壳与内容原语——你正在看的这个站点,就是 MiniSiteTemplate 的实例。"
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
