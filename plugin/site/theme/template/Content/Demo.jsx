/* eslint jsx-a11y/no-noninteractive-element-interactions: 0 */
import { Tooltip } from 'antd'
import classNames from 'classnames'
import React from 'react'
import ReactDOM from 'react-dom'
import BrowserFrame from '../BrowserFrame'
import FormattedMessage from '../FormattedMessage'
import EditButton from './EditButton'
import ErrorBoundary from './ErrorBoundary'

export default class Demo extends React.Component {
  static contextTypes = {}

  state = {
    codeExpand: false,
    copied: false,
    copyTooltipVisible: false,
  }

  componentDidMount() {
    const { meta, location, history } = this.props
    if (meta.id === location.hash.slice(1)) {
      this.anchor.click()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { codeExpand, copied, copyTooltipVisible } = this.state
    const { expand } = this.props
    return (
      (codeExpand || expand) !== (nextState.codeExpand || nextProps.expand) ||
      copied !== nextState.copied ||
      copyTooltipVisible !== nextState.copyTooltipVisible
    )
  }

  getSourceCode() {
    const { highlightedCode } = this.props
    if (typeof document !== 'undefined') {
      const div = document.createElement('div')
      div.innerHTML = highlightedCode[1].highlighted
      return div.textContent
    }
    return ''
  }

  handleCodeExpand = (demo) => {
    const { codeExpand } = this.state
    this.setState({ codeExpand: !codeExpand })
    this.track({
      type: 'expand',
      demo,
    })
  }

  saveAnchor = (anchor) => {
    this.anchor = anchor
  }

  handleCodeCopied = (demo) => {
    this.setState({ copied: true })
    this.track({
      type: 'copy',
      demo,
    })
  }

  onCopyTooltipVisibleChange = (visible) => {
    if (visible) {
      this.setState({
        copyTooltipVisible: visible,
        copied: false,
      })
      return
    }
    this.setState({
      copyTooltipVisible: visible,
    })
  }

  // eslint-disable-next-line
  track({ type, demo }) {
    if (!window.gtag) {
      return
    }
    window.gtag('event', 'demo', {
      event_category: type,
      event_label: demo,
    })
  }

  render() {
    const { state } = this
    const { props } = this
    const { meta, src, content, preview, highlightedCode, style, highlightedStyle, expand } = props

    if (!this.liveDemo) {
      this.liveDemo = meta.iframe ? (
        <BrowserFrame>
          <iframe src={src} height={meta.iframe} title="demo" />
        </BrowserFrame>
        // 统一添加history对象, 自动添加uniqueKey
      ) : React.cloneElement(preview(React, ReactDOM), { history: window.$$history, uniqueKey: meta.filename })
    }

    const codeExpand = state.codeExpand || expand
    const codeBoxClass = classNames('code-box', {
      expand: codeExpand,
      'code-box-debug': meta.debug,
    })

    const localizedTitle = meta.title
    const localizeIntro = content
    const introChildren = props.utils.toReactComponent(['div'].concat(localizeIntro))

    const highlightClass = classNames({
      'highlight-wrapper': true,
      'highlight-wrapper-expand': codeExpand,
    })

    const prefillStyle = `@import 'antd/dist/antd.css';\n\n${style || ''}`.replace(
      new RegExp(`#${meta.id}\\s*`, 'g'),
      '',
    )

    let sourceCode = this.getSourceCode()

    sourceCode = sourceCode.replace(/ReactDOM\.render\(\<Hetu\s+/, 'ReactDOM.render(<Hetu history={window.$$history}')

    const riddlePrefillConfig = {
      title: `${localizedTitle} - 河图 Demo`,
      js: sourceCode,
      css: prefillStyle,
    }

    return (
      <section className={codeBoxClass} id={meta.id}>
        <section className="code-box-demo">
          <ErrorBoundary>{this.liveDemo}</ErrorBoundary>
          {style ? (
            <style dangerouslySetInnerHTML={{ __html: style }} /> // eslint-disable-line
          ) : null}
        </section>
        <section className="code-box-meta markdown">
          <div className="code-box-title">
            <Tooltip title={meta.debug ? <FormattedMessage id="app.demo.debug" /> : ''}>
              <a href={`#${meta.id}`} ref={this.saveAnchor}>
                {localizedTitle}
              </a>
            </Tooltip>
            <EditButton
              title={<FormattedMessage id="app.content.edit-demo" />}
              filename={meta.filename}
            />
          </div>
          <div className="code-box-description">{introChildren}</div>
          <div className="code-box-actions" style={{ padding: '6px 0', cursor: 'pointer' }} onClick={() => this.handleCodeExpand(meta.id)}>
            <span style={{ whiteSpace: 'nowrap', verticalAlign: 'middle', width: 'auto', height: 'auto', color: '#1890ff' }}><FormattedMessage id={`app.demo.code.${codeExpand ? 'hide' : 'show'}`} /></span>
            <span className="code-expand-icon" style={{ verticalAlign: 'middle' }}>
              <img
                alt="expand code"
                src="https://gw.alipayobjects.com/zos/rmsportal/wSAkBuJFbdxsosKKpqyq.svg"
                className={codeExpand ? 'code-expand-icon-hide' : 'code-expand-icon-show'}
              />
              <img
                alt="expand code"
                src="https://gw.alipayobjects.com/zos/rmsportal/OpROPHYqWmrMDBFMZtKF.svg"
                className={codeExpand ? 'code-expand-icon-show' : 'code-expand-icon-hide'}
              />
            </span>
          </div>
        </section>
        <section className={highlightClass} key="code">
          <div className="highlight">{props.utils.toReactComponent(highlightedCode)}</div>
          {highlightedStyle ? (
            <div key="style" className="highlight">
              <pre>
                <code className="css" dangerouslySetInnerHTML={{ __html: highlightedStyle }} />
              </pre>
            </div>
          ) : null}
        </section>
      </section>
    )
  }
}
