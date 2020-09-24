import React, { Component } from 'react'
import { Radio } from 'antd'
import { isArray, get } from 'lodash'
import { connect } from 'dva'
import queryString from 'query-string'
import { RadioChangeEvent } from 'antd/es/radio'

import TheCard from './components/Card'
import './index.less'
import { PageTemplatesProps, PageTemplatesState } from './interface'

import { getDefaultSubmodule } from '~/constant/submodule'
import { initSubmodules } from '~/utils'

@connect()
export default class PageTemplates extends Component<PageTemplatesProps, PageTemplatesState> {
  static displayName = 'PageTemplates'

  static propTypes = {}

  static defaultProps = {}

  state = {
    activeTabKey: 'all',
    templateData: [],
  } as PageTemplatesState

  async componentDidMount() {
    document.title = '河图-模版市场'
    const { dispatch } = this.props
    const { id } = queryString.parse(window.location.search)
    // 根据页面路径获取项目详情
    const projectDetail = await dispatch({
      type: 'global/getAsyncProjectDetailById',
      payload: { projectId: id },
    })
    const submodules = projectDetail.submodules || getDefaultSubmodule()
    await initSubmodules(submodules)
    this.setState({
      // @ts-ignore
      templateData: get(window, ['Hetu', 'templateData'], [])
    })
  }

  handleTabChange = (e: RadioChangeEvent) => {
    this.setState({
      activeTabKey: e.target.value,
    })
  }

  renderCards = () => {
    const { activeTabKey, templateData=[] } = this.state
    return (
      templateData.map(({data}:any, index:number)=>(
        <div key={index} style={{display: (activeTabKey === 'all' || activeTabKey == index) ? 'flex' : 'none', flexWrap: 'wrap'}}>
          { data.map((item:any, i:number)=><TheCard key={i} data={item} />) }
        </div>
      ))
    )
  }

  render() {
    const { activeTabKey, templateData=[] } = this.state
    return (
      <div className="page-templates">
        <div className="page-templates-tabs">
          <Radio.Group
            defaultValue={activeTabKey}
            onChange={this.handleTabChange}
            buttonStyle="solid"
          >
            <Radio.Button value="all" key="all">
              全部
            </Radio.Button>
            {
              templateData.map((item:any,index:number)=>(
              <Radio.Button value={index} key={index}>
                {item.category}
              </Radio.Button>
              ))
            }
          </Radio.Group>
        </div>
        <div className="page-templates-content">{this.renderCards()}</div>
      </div>
    )
  }
}
