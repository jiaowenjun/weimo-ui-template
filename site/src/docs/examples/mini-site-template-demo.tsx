import { useNavigate } from 'react-router'

import { ComponentPreviewCard } from 'weimo-ui-core/components/component-preview-card'
import { FrostedIconButton } from 'weimo-ui-core/components/frosted-icon-button'
import { MiniSiteTemplate } from 'weimo-ui-template/components/mini-site-template'

import { examplePath } from '../routes'
import './mini-site-template-demo.css'

const repoUrl = 'https://github.com/jiaowenjun/weimo-ui-template'

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

/* lucide-react 1.x 已移除品牌图标,GitHub 标记内联为 SVG(与 editor 站一致) */
function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="currentColor"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

/** MiniSiteTemplate 整页演示:顶栏插槽 + 三态主题循环 + hero 标题区。 */
export function MiniSiteTemplateDemo() {
  const navigate = useNavigate()

  return (
    <MiniSiteTemplate
      headline="无侧边栏的单页站壳"
      pageTitle="MiniSiteTemplate"
      siteName="weimo-ui-template"
      subheadline="顶栏插槽、三态主题循环与 document.title 开箱即用;内容区不限布局宽度,顶栏同步对齐。"
      topBarActions={
        <FrostedIconButton
          aria-label="GitHub 仓库"
          onClick={() => window.open(repoUrl, '_blank', 'noopener,noreferrer')}
        >
          <GitHubIcon />
        </FrostedIconButton>
      }
      topBarLeading={
        <FrostedIconButton
          aria-label="返回文档"
          onClick={() => navigate(examplePath)}
        >
          <ChevronLeftIcon />
        </FrostedIconButton>
      }
    >
      <ComponentPreviewCard label="顶栏插槽">
        <p className="mini-site-template-demo__card-description">
          左侧 topBarLeading 放返回按钮,右侧 topBarActions
          放仓库链接;主题切换按钮默认居最右,与本页顶栏一致。
        </p>
      </ComponentPreviewCard>

      <ComponentPreviewCard label="三态主题循环">
        <p className="mini-site-template-demo__card-description">
          右上角按钮按 light → dark → system
          循环,并同步 html.dark;
          <code>showThemeToggle={'{false}'}</code>{' '}
          可隐藏该按钮,把位置让给站点自己的操作。
        </p>
      </ComponentPreviewCard>

      <ComponentPreviewCard label="阅读宽度内容区">
        <p className="mini-site-template-demo__card-description">
          headline 提供时,标题区与内容一起收进限宽的 hero
          阅读宽度;不提供时内容区全宽展开,只保留页边留白。
        </p>
      </ComponentPreviewCard>
    </MiniSiteTemplate>
  )
}
