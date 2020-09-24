import collect from 'bisheng/collect'
import { isFunction } from 'lodash-es'
import MainContent from './MainContent'
import '../../../hetu'

window.$$PUBLIC_URL = window.location.origin

function getPageData(pathname, nextProps, pageDataPath) {
  if (pathname.indexOf('changelog') >= 0) {
    return nextProps.data.changelog.changelog
  }

  if (pathname.indexOf('changelogEditor') >= 0) {
    return nextProps.data.changelog.changelogEditor
  }

  return nextProps.utils.get(nextProps.data, pageDataPath)
}

export default collect(async (nextProps) => {
  const { pathname } = nextProps.location

  const pageDataPath = pathname
    .replace('-cn', '')
    .replace('src/', '')
    .split('/')
  const pageData = getPageData(pathname, nextProps, pageDataPath)

  if (!pageData) {
    throw 404 // eslint-disable-line no-throw-literal
  }


  let pageDataPromise
  if (isFunction(pageData)) {
    pageDataPromise = pageData()
  } else if (isFunction(pageData.index)) {
    pageDataPromise = pageData.index()
  } else if (isFunction(pageData.index.npm)) {
    pageDataPromise = pageData.index.npm()
  } else if (isFunction(pageData.index.editor)) {
    pageDataPromise = pageData.index.editor()
  }

  const demosFetcher = nextProps.utils.get(nextProps.data, [...pageDataPath, 'demo'])

  if (demosFetcher) {
    const [localizedPageData, demos] = await Promise.all([pageDataPromise, demosFetcher()])
    return { localizedPageData, demos }
  }

  return { localizedPageData: await pageDataPromise }
})(MainContent)
