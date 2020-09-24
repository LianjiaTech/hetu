import { Col, Icon, Tooltip as NewTooltip } from 'antd'
import {
  Axis,
  Chart,
  Coord,
  Facet,
  Geom,
  Guide,
  Label,
  Legend,
  Shape,
  Tooltip,
  Util,
  View,
} from 'bizcharts'
import Slider from 'bizcharts-plugin-slider'
import React from 'react'
import '../shapes'
import { BizChartProps, BizChartState } from './interface'

class BizChart extends React.Component<BizChartProps, BizChartState> {
  static defaultProps = {
    colProps: {
      span: 24,
    },
  }

  state: BizChartState = {}

  render() {
    let {
      title,
      tooltip,
      colProps,
      data,
      children,
      pagestate,
      ...rest
    } = this.props

    return (
      <Col {...colProps}>
        <div className="ht-bchart-title">
          <span>{title}</span>
          {tooltip && (
            <NewTooltip title={tooltip}>
              <Icon type="question-circle-o" style={{ marginLeft: '5px' }} />
            </NewTooltip>
          )}
        </div>

        <Chart {...rest} data={data} forceFit={true}>
          {children}
        </Chart>
      </Col>
    )
  }
}

export default {
  Chart: BizChart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
  Slider,
}
