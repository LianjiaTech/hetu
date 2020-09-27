import collect from 'bisheng/collect'
import { isFunction } from 'lodash-es'
import * as React from 'react'
import Article from '../Content/Article'
import './index.less'

function getUnitString(unit) {
  if (!unit) return ''

  const last = unit[unit.length - 1]
  return Array.isArray(last) ? getUnitString(last) : last
}

function toList([, ...items]) {
  return [
    'div',
    {
      className: 'ant-row resource-cards',
      style: 'margin: -12px -12px 0 -12px',
    },
    ...items.map(([, title, [, image, description, link]]) => {
      let titleStr = getUnitString(title)
      const imageStr = getUnitString(image)
      const descStr = getUnitString(description)
      const linkStr = getUnitString(link)

      let coverColor = null
      const titleMatch = titleStr.match(/(.*)(#[\dA-Fa-f]{6})/)
      if (titleMatch) {
        titleStr = titleMatch[1].trim()
        // eslint-disable-next-line prefer-destructuring
        coverColor = titleMatch[2]
      }

      return [
        'div',
        {
          className:
            'ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-8 ant-col-lg-6 gutter-row',
          style: 'padding: 12px;',
        },
        [
          'a',
          { className: 'resource-video-card', target: '_blank', href: linkStr },
          [
            'img',
            {
              className: 'resource-card-image',
              src: imageStr,
              alt: titleStr,
              style: coverColor
                ? {
                    backgroundColor: coverColor,
                    objectFit: 'contain',
                  }
                : {},
            },
          ],
          ['p', { className: 'resource-card-title' }, titleStr],
          ['p', { className: 'resource-card-description' }, descStr],
        ],
      ]
    }),
  ]
}

function injectCards(content) {
  const newContent = []

  for (let i = 0; i < content.length; i += 1) {
    const unit = content[i]

    if (Array.isArray(unit) && unit[1].class === 'next-block-use-cards') {
      newContent.push(toList(content[i + 1]))

      i += 1
    } else {
      newContent.push(unit)
    }
  }

  return newContent
}

const Resources = props => {
  const { localizedPageData } = props

  const content = React.useMemo(() => injectCards(localizedPageData.content), [
    localizedPageData.content,
  ])

  return (
    <div id="resources-page">
      <Article
        {...props}
        content={{
          ...localizedPageData,
          content,
        }}
        titleRegionClassName="title-region"
      />
    </div>
  )
}

export default collect(async nextProps => {
  const { pathname } = nextProps.location
  const pageDataPath = pathname
    .replace('-cn', '')
    .replace('src/', '')
    .split('/')
  const pageData = nextProps.utils.get(nextProps.data, pageDataPath)

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

  return { localizedPageData: await pageDataPromise }
})(Resources)
