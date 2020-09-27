
import { Col, Menu, Row, Select } from 'antd'
import { Link } from 'bisheng/router'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { version as antdVersion } from '../../../../package.json'
import FormattedMessage from '../FormattedMessage'
import * as utils from '../utils'

const { Option } = Select

let docsearch
if (typeof window !== 'undefined') {
  docsearch = require('docsearch.js') // eslint-disable-line
}

export default class Header extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }

  state = {
    menuVisible: false,
  }

  componentDidMount() {
    const { router } = this.context
    router.listen(this.handleHideMenu)
    const { searchInput } = this
  }

  handleShowMenu = () => {
    this.setState({
      menuVisible: true,
    })
  }

  handleHideMenu = () => {
    this.setState({
      menuVisible: false,
    })
  }

  onMenuVisibleChange = (visible) => {
    this.setState({
      menuVisible: visible,
    })
  }

  handleVersionChange = (url) => {
    const currentUrl = window.location.href
    const currentPathname = window.location.pathname
    window.location.href = currentUrl
      .replace(window.location.origin, url)
      .replace(currentPathname, utils.getLocalizedPathname(currentPathname))
  }

  handleLangChange = () => {
    const {
      location: { pathname },
    } = this.props
    const currentProtocol = `${window.location.protocol}//`
    const currentHref = window.location.href.substr(currentProtocol.length)

    window.location.href =
      currentProtocol +
      currentHref.replace(
        window.location.pathname,
        utils.getLocalizedPathname(pathname, !utils.isZhCN(pathname)),
      )
  }

  render() {
    const { menuVisible } = this.state
    const { isMobile } = this.context
    const menuMode = isMobile ? 'inline' : 'horizontal'
    const { location, themeConfig } = this.props
    const docVersions = { ...themeConfig.docVersions, [antdVersion]: antdVersion }
    const versionOptions = Object.keys(docVersions).map((version) => (
      <Option value={docVersions[version]} key={version}>
        {version}
      </Option>
    ))
    const module = location.pathname
      .replace(/(^\/|\/$)/g, '')
      .split('/')
      .slice(0, -1)
      .join('/')
    let activeMenuItem = module || 'home'

    if (location.pathname === 'changelogEditor') {
      activeMenuItem = 'docs/editor'
    }

    if (location.pathname === 'changelog') {
      activeMenuItem = 'docs/npm'
    }

    const isZhCN = true

    const headerClassName = classNames({
      clearfix: true,
    })

    const menu = [
      // <Button
      //   ghost
      //   size="small"
      //   onClick={this.handleLangChange}
      //   className="header-lang-button"
      //   key="lang-button"
      // >
      //   <FormattedMessage id="app.header.lang" />
      // </Button>,
      // <Select
      //   key="version"
      //   className="version"
      //   size="small"
      //   dropdownMatchSelectWidth={false}
      //   defaultValue={antdVersion}
      //   onChange={this.handleVersionChange}
      //   getPopupContainer={(trigger) => trigger.parentNode}
      // >
      //   {versionOptions}
      // </Select>,
      <Menu
        className="menu-site"
        mode={menuMode}
        selectedKeys={[activeMenuItem]}
        id="nav"
        key="nav"
      >
        {/* <Menu.Item key="home" className="hide-in-home-page">
          <Link to={utils.getLocalizedPathname('/', isZhCN)}>
            <FormattedMessage id="app.header.menu.home" />
          </Link>
        </Menu.Item> */}
        <Menu.Item key="docs/editor">
          <Link to="/docs/editor/01-introduce">
            <FormattedMessage id="app.header.menu.editor" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/resources">
          <Link to="/docs/resources/video">
            <FormattedMessage id="app.header.menu.resources" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/stark">
          <Link to="/docs/stark/01-introduce">
            <FormattedMessage id="app.header.menu.stark" />
          </Link>
        </Menu.Item>
        {/* <Menu.Item key="docs/stark">
          <Link to="/docs/stark/01-introduce">
            <FormattedMessage id="app.header.menu.stark" />
          </Link>
        </Menu.Item>
        <Menu.Item key="docs/customize">
          <Link to="/docs/customize/01-introduce">
            <FormattedMessage id="app.header.menu.customize" />
          </Link>
        </Menu.Item> */}
        {/* <Menu.SubMenu
          key="ecosystem"
          className="hide-in-home-page"
          title={<FormattedMessage id="app.header.menu.ecosystem" />}
        >
          <Menu.Item key="pro">
            <a
              href="http://pro.ant.design"
              className="header-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FormattedMessage id="app.header.menu.pro" />
            </a>
          </Menu.Item>
          <Menu.Item key="ng">
            <a
              href="http://ng.ant.design"
              className="header-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              河图 of Angular
            </a>
          </Menu.Item>
          <Menu.Item key="vue">
            <a
              href="http://vue.ant.design"
              className="header-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              河图 of Vue
            </a>
          </Menu.Item>
          {isZhCN ? (
            <Menu.Item key="course" className="hide-in-home-page">
              <a
                href="https://www.yuque.com/ant-design/course"
                className="header-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                河图 实战教程
              </a>
            </Menu.Item>
          ) : null}
        </Menu.SubMenu> */}
      </Menu>,
    ]

    const searchPlaceholder = '搜索'
    return (
      <header id="header" className={headerClassName}>
        {/* {isMobile && (
          <Popover
            overlayClassName="popover-menu"
            placement="bottomRight"
            content={menu}
            trigger="click"
            visible={menuVisible}
            arrowPointAtCenter
            onVisibleChange={this.onMenuVisibleChange}
          >
            <Icon className="nav-phone-icon" type="menu" onClick={this.handleShowMenu} />
          </Popover>
        )} */}
        <Row>
          <Col xxl={4} xl={5} lg={5} md={5} sm={24} xs={24}>
            <Link to={utils.getLocalizedPathname('/', isZhCN)} id="logo">
              <img
                alt="logo"
                src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ff9ed6fd5674d86bd4750ce35652260~tplv-k3u1fbpfcp-zoom-1.image"
              />
              <span style={{ fontSize: '24px', color: '#333', verticalAlign: 'middle' }}>河图</span>
            </Link>
          </Col>
          {/* <Col xxl={20} xl={19} lg={19} md={19} sm={0} xs={0}>
            <div id="search-box">
              <Icon type="search" />
              <Input
                ref={(ref) => {
                  this.searchInput = ref
                }}
                placeholder={searchPlaceholder}
              />
            </div>
          </Col> */}
          {!isMobile && menu}
        </Row>
      </header>
    )
  }
}
