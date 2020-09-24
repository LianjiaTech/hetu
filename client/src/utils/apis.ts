export function transformPath(path: string) {
  if (window.__POWERED_BY_QIANKUN__) {
    let map = store.get('hetu-pageconfigs-map')
    path = _.get(map, path, path)
  }
  return path
}
