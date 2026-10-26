export const examplePath = '/examples/site-template'
export const miniExamplePath = '/examples/mini-site-template'
export const iframeExamplePath = '/examples/site-template-iframe'
export const iframeFitExamplePath = '/examples/site-template-iframe-fit'
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

export function iframeExampleHref() {
  return withBasename(iframeExamplePath)
}

export function iframeFitExampleHref() {
  return withBasename(iframeFitExamplePath)
}

export function siteTemplatePreviewHref() {
  return withBasename(siteTemplatePreviewPath)
}
