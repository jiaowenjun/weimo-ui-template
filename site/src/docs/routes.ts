export const examplePath = '/examples/site-template'

export const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export function exampleHref() {
  if (!routerBasename) {
    return examplePath
  }

  return `${routerBasename}${examplePath}`
}
