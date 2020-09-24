import { ConfigProvider } from 'antd'
// import 'antd/dist/antd.css'
import 'antd/dist/antd.less'
import zhCN from 'antd/es/locale/zh_CN'
import { enquireScreen } from 'enquire-js'
import 'moment/locale/zh-cn'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'

if (typeof window !== 'undefined' && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister())
  })
}

if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  require('../../static/style')

  // Expose to iframe
  window.react = React
  window['react-dom'] = ReactDOM
  window.antd = require('antd')

  /* eslint-enable global-require */

  // Error log statistic
  window.addEventListener('error', function onError(e) {
    // Ignore ResizeObserver error
    if (e.message === 'ResizeObserver loop limit exceeded') {
      e.stopPropagation()
      e.stopImmediatePropagation()
    }
  })
}

let isMobile = false
enquireScreen((b) => {
  isMobile = b
})

export default class Layout extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    isMobile: PropTypes.bool,
  }

  constructor (props) {
    super(props)

    window.$$history = props.router
    this.state = {
      isMobile,
    }
  }

  getChildContext() {
    const { isMobile: mobile } = this.state
    return { isMobile: mobile }
  }

  componentDidMount() {
    const { router } = this.context
    router.listen((loc) => {
      if (typeof window.ga !== 'undefined') {
        window.ga('send', 'pageview', loc.pathname + loc.search)
      }
      // eslint-disable-next-line
      if (typeof window._hmt !== 'undefined') {
        // eslint-disable-next-line
        window._hmt.push(['_trackPageview', loc.pathname + loc.search])
      }
    })

    const nprogressHiddenStyle = document.getElementById('nprogress-style')
    if (nprogressHiddenStyle) {
      this.timer = setTimeout(() => {
        nprogressHiddenStyle.parentNode.removeChild(nprogressHiddenStyle)
      }, 0)
    }

    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      })
    })
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    const { children, ...restProps } = this.props

    // Temp remove SentryBoundary
    return (
      <ConfigProvider prefixCls="ht" locale={zhCN}>
        <div className="page-wrapper">
          <Header {...restProps} />
          {children}
        </div>
      </ConfigProvider>
    )
  }
}
