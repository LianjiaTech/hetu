import React, { Component } from 'react'
import { Layout, Menu, Icon, Tooltip } from 'antd'
import { pathToRegexp } from 'path-to-regexp'
import { Link } from 'dva/router'

import _, { isArray, isEqual, get } from 'lodash'

import './index.less'
import { urlToList } from '~/components/_utils/pathTools'

import defaultLogo from '~/assets/logo.png'

import { TheSiderMenuProps, TheSiderMenuState, menuItem } from './interface'
const { Sider } = Layout
const { SubMenu } = Menu

const getIcon = (icon: string | React.ReactNode) => {
  if (typeof icon === 'string') {
    if (icon.indexOf('http') === 0) {
      return (
        <img src={icon} alt="icon" className={`icon sider-menu-item-img`} />
      )
    }
    return <Icon type={icon} />
  }

  return icon
}

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
const getMenuMatchKeys = (flatMenuKeys: string[], paths: string[]) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(
        flatMenuKeys.filter(item => pathToRegexp(item).test(path))
      ),
    []
  )

class TheSiderMenu extends Component<TheSiderMenuProps, TheSiderMenuState> {
  static displayName = 'TheSiderMenu'

  static defaultProps = {
    logo:
      'http://file.ljcdn.com/hetu-cdn/1557744341678.1bb87d41d15fe27b500a4bfcde01bb0e.png',
  }

  state: TheSiderMenuState = {
    // 菜单展开的keys
    openKeys: null,
    // 是否展开
    collapsed: false,
  }

  async componentDidMount() {
    const { projectDetail } = this.props
    const menuData: menuItem[] = _.get(projectDetail, 'layout.menu_data')

    const flatMenuKeys = getFlatMenuKeys(menuData)

    const openKeys = this.getDefaultCollapsedSubMenus(
      flatMenuKeys,
      window.location.pathname
    )

    this.setState({
      openKeys,
      flatMenuKeys,
    })
  }

  async componentDidUpdate(prevProps: TheSiderMenuProps, prevState: TheSiderMenuState) {


    // pathname 变化
    if (!isEqual(prevProps.history.location.pathname, this.props.history.location.pathname)) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(
          this.state.flatMenuKeys,
          this.props.history.location.pathname
        ),
      })
    }
  }

  /**
   * Convert pathname to openKeys
   * /list/search/articles = > ['list','/list/search']
   * @param  props
   */
  getDefaultCollapsedSubMenus(flatMenuKeys: string[], pathname: string) {
    return getMenuMatchKeys(flatMenuKeys, urlToList(pathname))
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item: menuItem) => {
    const itemPath = this.conversionPath(item.path)
    const icon = getIcon(item.icon)
    const { target, name } = item
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      )
    }

    const { pathname } = window.location
    return (
      <Link to={itemPath} target={target} replace={itemPath === pathname}>
        {icon}
        <span>{name}</span>
      </Link>
    )
  }

  getSubMenuOrItem = (item: menuItem) => {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children)
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (
                  item.name
                )
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        )
      }
      return null
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>
    }
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menuData: menuItem[]) => {
    if (!isArray(menuData)) return []
    return menuData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        return this.getSubMenuOrItem(item)
      })
      .filter(item => item)
  }

  // Get the currently selected menu
  getSelectedMenuKeys = (flatMenuKeys: string[], pathname: string) => {
    return getMenuMatchKeys(flatMenuKeys, urlToList(pathname))
  }

  // conversion Path
  // 转化路径
  conversionPath = (path: string) => {
    if (path && path.indexOf('http') === 0) {
      return path
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/')
    }
  }

  isMainMenu = (key: string) => {
    const menuData: menuItem[] = _.get(this.props.projectDetail, 'layout.menu_data')
    return menuData.some(item => key && (item.key === key || item.path === key))
  }

  handleOpenChange = (openKeys: string[]) => {
    const lastOpenKey = openKeys[openKeys.length - 1]
    const moreThanOne =
      openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    })
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({
      collapsed,
    })
  }

  render() {
    const { openKeys, flatMenuKeys, collapsed } = this.state
    const {
      projectDetail,
      history,
      ...otherProps
    } = this.props

    const menuData: menuItem[] = _.get(projectDetail, 'layout.menu_data')

    const location = history.location
    const { home: homeLink, name: projectName, logo } = projectDetail



    if (!isArray(menuData) || !isArray(flatMenuKeys)) {
      return null
    }

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed
      ? {}
      : {
        openKeys,
      }

    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(flatMenuKeys, location.pathname)
    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]]
    }

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={this.onCollapse}
        width={256}
        className="base-sidermenu"
        {...otherProps}
      >
        {homeLink ? (
          <Tooltip title="返回首页">
            <a href={homeLink} className="logo" key="logo">
              <img src={logo || defaultLogo} alt="logo" />
              {!collapsed && <h1>{projectName || '河图'}</h1>}
            </a>
          </Tooltip>
        ) : (
            <div className="logo" key="logo">
              <img src={logo || defaultLogo} alt="logo" />
              {!collapsed && <h1>{projectName || '河图'}</h1>}
            </div>
          )}

        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{ padding: '16px 0', width: '100%' }}
        >
          {this.getNavMenuItems(menuData)}
        </Menu>
      </Sider>
    )
  }
}


/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => [path,path2]
 * @param  menu
 */
function getFlatMenuKeys(menu: menuItem[]): string[] {
  return menu.reduce((keys, item) => {
    keys.push(item.path)
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children))
    }
    return keys
  }, [])
}

export default TheSiderMenu
