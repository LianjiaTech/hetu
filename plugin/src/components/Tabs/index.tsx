import { Tabs } from 'antd'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import * as ReactIs from 'react-is'
import HtCard from '~/components/Card'
import { updateComponentAlias } from '~/utils'
import { ListComponentProps } from './interface'

const TabPane = Tabs.TabPane
const ComponentAlias = '$$HtTabsActiveTab'

updateComponentAlias(ComponentAlias, undefined)

export class HtTabs extends Component<ListComponentProps> {
  static displayName = 'HtTabs'

  static __isContainer__ = true

  static defaultProps = {
    tabsType: 'line',
    tabsPosition: 'top',
  }

  tabMap = {}

  componentDidMount() {
    const { defaultActiveKey, pagestate } = this.props
    const activeTab = _.get(pagestate, ComponentAlias, defaultActiveKey)

    if (activeTab) {
      this.onTabChange(activeTab)
    }
  }

  onTabChange = (key: string) => {
    const { setStoreState } = this.props.pagestate
    setStoreState({
      [ComponentAlias]: key,
    })
  }

  renderTabs = (extra: React.ReactNode, activeTab: string) => {
    const { tabs, tabsPosition, tabsType, tabBarStyle } = this.props
    if (!tabs || !Array.isArray(tabs)) {
      return null
    }

    return (
      <Tabs
        activeKey={activeTab}
        onChange={this.onTabChange}
        tabBarExtraContent={extra}
        type={tabsType}
        tabPosition={tabsPosition}
        tabBarStyle={tabBarStyle}
      >
        {tabs.map(v => {
          _.set(this.tabMap, v.value, v)
          return <TabPane tab={v.title} key={v.value} disabled={v.disabled} />
        })}
      </Tabs>
    )
  }

  renderContent = (content: React.ReactNode[], activeTab: string) => {
    if (!_.isArray(content)) {
      console.error(`content must be an array`)
      return null
    }

    const currentItem = _.get(this.tabMap, activeTab)

    if (!currentItem) {
      console.error(`activeTab=${activeTab} 没找到!`)
      return null
    }

    let showIndexs: number[] = _.get(currentItem, 'showIndexs', [])

    if (_.isArray(showIndexs) && showIndexs.length === 0) {
      // 显示全部
      return content
    }

    return content
      .filter((_v, i) => showIndexs.indexOf(i) !== -1)
      .map((child, i) => {
        return ReactIs.isElement(child)
          ? React.cloneElement(child, {
              key: `${i}-${activeTab}`,
            })
          : child
      })
  }

  render() {
    let {
      // Card配置
      isCard,
      extra,
      description,
      // tab配置
      defaultActiveKey,
      tabsType,
      tabsPosition,
      tabs,
      tabBarStyle,
      // 其他
      content,
      children,
      pagestate,
      'data-component-type': dataComponentype,
      'data-pageconfig-path': dataPageconfigPath,
      ...otherProps
    } = this.props

    const activeTab = _.get(
      this.props.pagestate,
      ComponentAlias,
      defaultActiveKey
    )

    return (
      <HtCard
        isCard={isCard}
        extra={extra}
        cardType="plain"
        description={description}
        pagestate={pagestate}
        data-component-type={dataComponentype}
        data-pageconfig-path={dataPageconfigPath}
        {...otherProps}
        render={({ Extra }) => (
          <div className="ht-list">
            {this.renderTabs(Extra, activeTab)}
            {this.renderContent(content, activeTab)}
          </div>
        )}
      />
    )
  }
}

export default observer(HtTabs)
