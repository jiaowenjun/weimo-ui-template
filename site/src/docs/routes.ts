export const examplePath = '/examples/site-template'
export const landingExamplePath = '/examples/landing-template'

export const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

export function exampleHref() {
  if (!routerBasename) {
    return examplePath
  }

  return `${routerBasename}${examplePath}`
}

export function landingExampleHref() {
  if (!routerBasename) {
    return landingExamplePath
  }

  return `${routerBasename}${landingExamplePath}`
}
