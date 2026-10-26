export const examplePath = '/examples/site-template'
export const miniExamplePath = '/examples/mini-site-template'
export const iframeFollowSolidExamplePath =
  '/examples/site-template-iframe-follow-solid'
export const siteTemplatePreviewPath = '/previews/site-template'

export const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export function exampleHref() {
  if (!routerBasename) {
    return examplePath
  }

  return `${routerBasename}${examplePath}`
}

export function miniExampleHref() {
  if (!routerBasename) {
    return miniExamplePath
  }

  return `${routerBasename}${miniExamplePath}`
}

function withBasename(path: string) {
  return routerBasename ? `${routerBasename}${path}` : path
}

export function iframeFollowSolidExampleHref() {
  return withBasename(iframeFollowSolidExamplePath)
}

export function siteTemplatePreviewHref() {
  return withBasename(siteTemplatePreviewPath)
}
