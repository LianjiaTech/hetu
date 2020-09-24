import { Affix, Col, Icon, Row, Tooltip } from 'antd'
import classNames from 'classnames'
import { getChildren } from 'jsonml.js/lib/utils'
import { isString } from 'lodash/lang'
import { get } from 'lodash/object'
import React from 'react'
import DocumentTitle from 'react-document-title'
import FormattedMessage from '../FormattedMessage'
import { ping } from '../utils'
import Demo from './Demo'
import EditButton from './EditButton'

export default class ComponentDoc extends React.Component {
  static contextTypes = {}

  state = {
    expandAll: false,
    showRiddleButton: false
  }

  componentDidMount() {
    this.pingTimer = ping(status => {
      if (status !== 'timeout' && status !== 'error') {
        this.setState({
          showRiddleButton: true
        })
      }
    })
  }

  componentWillUnmount() {
    clearTimeout(this.pingTimer)
  }

  handleExpandToggle = () => {
    const { expandAll } = this.state
    this.setState({
      expandAll: !expandAll
    })
  }

  render() {
    const { props } = this
    const { doc, location } = props
    const { content, meta } = doc

    const demos = Object.keys(props.demos).map(key => props.demos[key])
    const { expandAll, showRiddleButton } = this.state

    const isSingleCol = meta.cols === 1
    const leftChildren = []
    const rightChildren = []
    const showedDemo = demos.some(demo => demo.meta.only)
      ? demos.filter(demo => demo.meta.only)
      : demos.filter(demo => demo.preview)

    showedDemo
      .sort((a, b) => a.meta.order - b.meta.order)
      .forEach((demoData, index) => {
        const demoElem = (
          <Demo
            {...demoData}
            key={demoData.meta.filename}
            utils={props.utils}
            expand={expandAll}
            location={location}
          />
        )
        if (index % 2 === 0 || isSingleCol) {
          leftChildren.push(demoElem)
        } else {
          rightChildren.push(demoElem)
        }
      })
    const expandTriggerClass = classNames({
      'code-box-expand-trigger': true,
      'code-box-expand-trigger-active': expandAll
    })

    const jumper = showedDemo.map(demo => {
      const { title } = demo.meta

      const localizeTitle = isString(title) ? title : ''
      const id = get(demo, 'meta.id')
      return (
        <li key={id} title={localizeTitle}>
          <a href={`#${id}`}>{localizeTitle}</a>
        </li>
      )
    })

    const { title, subtitle, filename } = meta
    const articleClassName = classNames({
      'show-riddle-button': showRiddleButton
    })
    return (
      <DocumentTitle title={`${subtitle || ''} ${title} - 河图`}>
        <article className={articleClassName}>
          <Affix className='toc-affix' offsetTop={16}>
            <ul id='demo-toc' className='toc'>
              {jumper}
            </ul>
          </Affix>
          <section className='markdown'>
            <h1>
              {title}
              {!subtitle ? null : <span className='subtitle'>{subtitle}</span>}
              <EditButton
                title={<FormattedMessage id='app.content.edit-page' />}
                filename={filename}
              />
            </h1>
            {props.utils.toReactComponent(
              ['section', { className: 'markdown' }].concat(
                getChildren(content)
              )
            )}
            <h2>
              <FormattedMessage id='app.component.examples' />
              <Tooltip
                title={
                  <FormattedMessage
                    id={`app.component.examples.${
                      expandAll ? 'collpse' : 'expand'
                      }`}
                  />
                }
              >
                <Icon
                  type={`${expandAll ? 'appstore' : 'appstore-o'}`}
                  className={expandTriggerClass}
                  onClick={this.handleExpandToggle}
                />
              </Tooltip>
            </h2>
          </section>
          <Row gutter={16}>
            <Col
              span={isSingleCol ? 24 : 12}
              className={
                isSingleCol ? 'code-boxes-col-1-1' : 'code-boxes-col-2-1'
              }
            >
              {leftChildren}
            </Col>
            {isSingleCol ? null : (
              <Col className='code-boxes-col-2-1' span={12}>
                {rightChildren}
              </Col>
            )}
          </Row>
          {props.utils.toReactComponent(
            [
              'section',
              {
                className: 'markdown api-container'
              }
            ].concat(getChildren(doc.api || ['placeholder']))
          )}
        </article>
      </DocumentTitle>
    )
  }
}
