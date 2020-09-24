import React, { Component } from 'react'
import { Layout, Tabs } from 'antd'

import TheSiderMenu from './SiderMenu'
import TheHeader from './Header'
import _ from 'lodash'

import { LayoutBasicProps, LayoutBasicState } from './interface'

import styles from './index.module.less'

const { Content, Footer } = Layout
const { TabPane } = Tabs

class LayoutBasic extends Component<LayoutBasicProps, LayoutBasicState> {
  static displayName = 'LayoutBasic'

  static propTypes = {}

  static defaultProps = {}

  state = {} as LayoutBasicState

  newTabIndex: number = 0

  onChange = (activeKey: string) => {
    const { history } = this.props
    history.replace(activeKey)
  };

  onEdit = (targetKey: string, action: 'remove') => {
    this[action](targetKey);
  };

  remove = (targetKey: string) => {
    let { history, activePanekey, panes, onChange } = this.props;

    if (panes.length === 1) {
      return false
    }

    let _panes = panes.filter(v => v.key !== targetKey)

    let _activePanekey = activePanekey
    if (activePanekey === targetKey) {
      _activePanekey = _panes[_panes.length - 1].key
      history.replace(_activePanekey)
    }

    onChange(_activePanekey, _panes)

  };

  render() {
    const { projectDetail, userInfo, activePanekey, panes, onChange, history, children, ...otherProps } = this.props

    return (
      <Layout {...otherProps} className={styles['the-layout-basic']}>
        <TheSiderMenu projectDetail={projectDetail} history={history} />
        <Layout>
          <TheHeader projectDetail={projectDetail} userInfo={userInfo} />
          <Content key='content' style={{ height: '100%', backgroundColor: '#fff' }}>
            <div className="the-breadcrumb" >
              {_.isArray(panes) && panes.length > 0 &&
                <Tabs
                  onChange={this.onChange}
                  activeKey={activePanekey}
                  type="editable-card"
                  className={styles['the-tabs']}
                  onEdit={this.onEdit}
                  hideAdd={true}
                >
                  {panes.map(pane => (
                    <TabPane tab={pane.title} key={pane.key} closable={panes.length <= 1 ? false : pane.closable}>
                    </TabPane>
                  ))}
                </Tabs>
              }
            </div>
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default LayoutBasic
