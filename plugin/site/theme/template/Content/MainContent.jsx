import { Affix, Col, Icon, Menu, Row, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import { Link } from 'bisheng/router'
import classNames from 'classnames'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import MobileMenu from 'rc-drawer'
import React, { Component } from 'react'
import * as utils from '../utils'
import Article from './Article'
import ComponentDoc from './ComponentDoc'
import PrevAndNext from './PrevAndNext'

const { SubMenu } = Menu

function getActiveMenuItem(props) {
  const { children } = props.params
  return (
    (children && children.replace('-cn', '')) ||
    props.location.pathname.replace(/(^\/|-cn$)/g, '')
  )
}

function getModuleData(props) {
  const { pathname } = props.location
  const moduleName = /^\/?components/.test(pathname)
    ? 'components'
    : pathname
      .split('/')
      .filter(item => item)
      .slice(0, 2)
      .join('/')

  const components = props.picked.Components

  const moduleData =
    moduleName === 'components' ||
      moduleName === 'docs/editor' ||
      moduleName === 'changelog'
      ? [
        ...components,
        ...props.picked['docs/editor']
      ]
      : [
        ...props.picked[moduleName]
      ]

  return moduleData
}

function fileNameToPath(filename) {
  const snippets = filename
    .replace(/(\/index)?((\.editor)|(\.npm))?\.md$/i, '')
    .split('/')
  return snippets[snippets.length - 1]
}

const getSideBarOpenKeys = nextProps => {
  const { themeConfig } = nextProps
  const moduleData = getModuleData(nextProps)
  const shouldOpenKeys = utils
    .getMenuItems(moduleData, themeConfig.categoryOrder, themeConfig.typeOrder)
    .map(m => m.title)
  return shouldOpenKeys
}

export default class MainContent extends Component {
  static contextTypes = {
    isMobile: PropTypes.bool.isRequired
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.openKeys) {
      return {
        ...state,
        openKeys: getSideBarOpenKeys(props)
      }
    }
    return null
  }

  state = {
    openKeys: undefined
  }

  componentDidMount() {
    this.componentDidUpdate()
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    const { location: prevLocation = {} } = prevProps || {}
    if (!prevProps || prevLocation.pathname !== location.pathname) {
      this.bindScroller()
    }
    if (!window.location.hash && prevLocation.pathname !== location.pathname) {
      document.documentElement.scrollTop = 0
    }
    // when subMenu not equal
    if (get(this.props, 'route.path') !== get(prevProps, 'route.path')) {
      // reset menu OpenKeys
      this.handleMenuOpenChange()
    }
    setTimeout(() => {
      if (!window.location.hash) {
        return
      }
      const element = document.getElementById(
        decodeURIComponent(window.location.hash.replace('#', ''))
      )
      if (element && document.documentElement.scrollTop === 0) {
        element.scrollIntoView()
      }
    }, 0)
  }

  componentWillUnmount() {
    this.scroller.disable()
  }

  getMenuItems(footerNavIcons = {}) {
    const { themeConfig } = this.props

    const moduleData = getModuleData(this.props)
    const menuItems = utils.getMenuItems(
      moduleData,
      themeConfig.categoryOrder,
      themeConfig.typeOrder
    )

    return (
      Array.isArray(menuItems) &&
      menuItems.map(menuItem => {
        if (menuItem.children) {
          return (
            <SubMenu title={<h4>{menuItem.title}</h4>} key={menuItem.title}>
              {menuItem.children.map(child => {
                if (child.type === 'type') {
                  return (
                    <Menu.ItemGroup title={child.title} key={child.title}>
                      {child.children
                        .map(leaf =>
                          this.generateMenuItem(false, leaf, footerNavIcons)
                        )}
                    </Menu.ItemGroup>
                  )
                }
                return this.generateMenuItem(false, child, footerNavIcons)
              })}
            </SubMenu>
          )
        }
        return this.generateMenuItem(true, menuItem, footerNavIcons)
      })
    )
  }

  getFooterNav(menuItems, activeMenuItem) {
    const menuItemsList = this.flattenMenu(menuItems)
    let activeMenuItemIndex = -1
    menuItemsList.forEach((menuItem, i) => {
      if (menuItem && menuItem.key === activeMenuItem) {
        activeMenuItemIndex = i
      }
    })
    const prev = menuItemsList[activeMenuItemIndex - 1]
    const next = menuItemsList[activeMenuItemIndex + 1]
    return { prev, next }
  }

  handleMenuOpenChange = openKeys => {
    this.setState({ openKeys })
  }

  bindScroller() {
    if (this.scroller) {
      this.scroller.disable()
    }
    require('intersection-observer') // eslint-disable-line
    const scrollama = require('scrollama') // eslint-disable-line
    this.scroller = scrollama()
    this.scroller
      .setup({
        step: '.markdown > h2, .code-box', // required
        offset: 0
      })
      .onStepEnter(({ element }) => {
        ;[].forEach.call(document.querySelectorAll('.toc-affix li a'), node => {
          node.className = '' // eslint-disable-line
        })
        const elementId = get(element, 'id')
        const currentNode = document.querySelectorAll(
          `.toc-affix li a[href="#${elementId}"]`
        )[0]
        if (currentNode) {
          currentNode.className = 'current'
        }
      })
  }

  generateMenuItem(isTop, item, { before = null, after = null }) {
    const key = fileNameToPath(item.filename)
    if (!item.title) {
      return null
    }
    const title = item.title
    const text = isTop
      ? title
      : [
        <span key='english'>{title}</span>,
        <span className='chinese' key='chinese'>
          {item.subtitle}
        </span>
      ]
    const { disabled } = item
    const url = item.filename.replace(
      /(\/index)?((\.editor)|(\.npm))?\.md$/i,
      ''
    )
    const child = !item.link ? (
      <Link
        to={utils.getLocalizedPathname(
          /^components/.test(url) ? `${url}/` : url
        )}
        disabled={disabled}
      >
        {before}
        {text}
        {after}
      </Link>
    ) : (
        <a
          href={item.link}
          target='_blank'
          rel='noopener noreferrer'
          disabled={disabled}
          className='menu-item-link-outside'
        >
          {before}
          {text} <Icon type='export' />
          {after}
        </a>
      )

    return (
      <Menu.Item key={key} disabled={disabled}>
        {child}
      </Menu.Item>
    )
  }

  flattenMenu(menu) {
    if (!menu) {
      return null
    }
    if (menu.type && menu.type.isMenuItem) {
      return menu
    }
    if (Array.isArray(menu)) {
      return menu.reduce((acc, item) => acc.concat(this.flattenMenu(item)), [])
    }
    return this.flattenMenu(
      (menu.props && menu.props.children) || menu.children
    )
  }

  render() {
    const { props } = this
    const { isMobile } = this.context
    const { openKeys } = this.state
    const activeMenuItem = getActiveMenuItem(props)
    const menuItems = this.getMenuItems()
    const menuItemsForFooterNav = this.getMenuItems({
      before: <Icon className='footer-nav-icon-before' type='left' />,
      after: <Icon className='footer-nav-icon-after' type='right' />
    })
    const { prev, next } = this.getFooterNav(
      menuItemsForFooterNav,
      activeMenuItem
    )
    const { localizedPageData } = props
    const mainContainerClass = classNames('main-container', {
      'main-container-component': !!props.demos
    })
    const menuChild = (
      <Menu
        inlineIndent='40'
        className='aside-container menu-site'
        mode='inline'
        openKeys={openKeys}
        selectedKeys={[activeMenuItem]}
        onOpenChange={this.handleMenuOpenChange}
      >
        {menuItems}
      </Menu>
    )
    return (
      <ConfigProvider prefixCls="ht" locale={zhCN}>
        <div className='main-wrapper'>
          <Row>
            {isMobile ? (
              <MobileMenu
                iconChild={[
                  <Icon key="menu-unfold" type='menu-unfold' />,
                  <Icon key="menu-fold" type='menu-fold' />
                ]}
                key='Mobile-menu'
                wrapperClassName='drawer-wrapper'
              >
                {menuChild}
              </MobileMenu>
            ) : (
                <Col
                  xxl={4}
                  xl={5}
                  lg={6}
                  md={24}
                  sm={24}
                  xs={24}
                  className='main-menu'
                >
                  <Affix>
                    <section className='main-menu-inner'>{menuChild}</section>
                  </Affix>
                </Col>
              )}
            <Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24}>
              <section className={mainContainerClass}>
                {props.demos ? (
                  <ComponentDoc
                    {...props}
                    doc={localizedPageData}
                    demos={props.demos}
                  />
                ) : (
                    <Article {...props} content={localizedPageData} />
                  )}
              </section>
              <PrevAndNext prev={prev} next={next} />
            </Col>
          </Row>
        </div>
      </ConfigProvider>

    )
  }
}
