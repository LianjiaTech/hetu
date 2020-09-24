import { isArray } from 'lodash-es'
const sortFn = (a, b) => (a.order || 0) - (b.order || 0)

const sortMenuItems = (menuItems) => {
  if (!isArray(menuItems)) {
    throw new TypeError('menuItems must be an array, but got' + menuItems)
  }

  return menuItems.map(item => {
    if (isArray(item.children)) {
      item.children = sortMenuItems(item.children)
    }
    return item
  }).sort(sortFn)
}

export function getMenuItems(moduleData, categoryOrder, typeOrder) {
  let menuMeta
  try {
    menuMeta = moduleData.map(item => item.meta)
  } catch (e) {
    console.error(e)
  }

  const menuItems = []

  menuMeta.sort(sortFn).forEach(meta => {
    if (!meta.category) {
      menuItems.push(meta)
    } else {
      const category = meta.category
      let group = menuItems.filter(i => i.title === category)[0]
      if (!group) {
        group = {
          type: 'category',
          title: category,
          children: [],
          order: categoryOrder[category]
        }
        menuItems.push(group)
      }
      if (meta.type) {
        let type = group.children.filter(i => i.title === meta.type)[0]
        if (!type) {
          type = {
            type: 'type',
            title: meta.type,
            children: [],
            order: typeOrder[meta.type]
          }
          group.children.push(type)
        }
        type.children.push(meta)
      } else {
        group.children.push(meta)
      }
    }
  })
  return sortMenuItems(menuItems)
}



export function isZhCN(pathname) {
  return /-cn\/?$/.test(pathname)
}

export function getLocalizedPathname(path, zhCN) {
  const pathname = path.startsWith('/') ? path : `/${path}`
  if (!zhCN) {
    // to enUS
    return /\/?index-cn/.test(pathname) ? '/' : pathname.replace('-cn', '')
  }
  if (pathname === '/') {
    return '/docs/editor/01-introduce'
  }
  if (pathname.endsWith('/')) {
    return pathname.replace(/\/$/, '-cn/')
  }
  return `${pathname}-cn`
}

export function ping(callback) {
  // eslint-disable-next-line
  const url =
    'https://private-a' +
    'lipay' +
    'objects.alip' +
    'ay.com/alip' +
    'ay-rmsdeploy-image/rmsportal/RKuAiriJqrUhyqW.png'
  const img = new Image()
  let done
  const finish = status => {
    if (!done) {
      done = true
      img.src = ''
      callback(status)
    }
  }
  img.onload = () => finish('responded')
  img.onerror = () => finish('error')
  img.src = url
  return setTimeout(() => finish('timeout'), 1500)
}

export function isLocalStorageNameSupported() {
  const testKey = 'test'
  const storage = window.localStorage
  try {
    storage.setItem(testKey, '1')
    storage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}
