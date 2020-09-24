---
order: 4
title: 多图+表格
---

* [数据源](http://mockjs.docway.net/mock/1XhtOi6ISFV/api/xxx/list)

- `formConfig` 表单, 属性与 [Form](/components/Form/) 保持一致
  - `url` 必填, 请求地址
  - `fields` 表单项
  - `transform` 请求数据格式转换
  - `method` 请求方法, 默认为`get`
  
- `tableConfig` 表格配置, 属性与 [List](/components/List/) 保持一致
  - `alias` 从接口返回值, 获取数据的路径, 默认为`list`
  - `pageSize` 每页数据量, 默认为20
  - `columns` 列配置

- `chartConfig` 图, 支持配置多张图
  - `alias` 从接口返回值, 获取数据的路径
  - `height` 图表高度
  - `scale` 
  - `content`

```jsx
import Hetu from 'hetu'

// 本地数据, 提前定义好变量, 避免控制台报错
const local = {
  "business_group_options": [],
  "business_line_options": []
}

// 远程数据
const remote = {
  "business_direction": {
    "url": "/api/business/direction"
  }
}

const lineChartConfig = {
  "alias": "lineChartData",
  "title": "折线图",
  "colProps": {
    "span": 12
  },
  "height": 400,
  "scale": {
    "month": {
      "range": [0, 1]
    }
  },
  "content": {
    "Legend": [{}],
    "Axis": [
      {"name": "month"}, { "name": "revenue"}
    ],
    "Geom": [
      { 
        "type": "line",
        "position": "month*revenue",
        "size": 2,
        "color": "city"
      },
      {
        "type": "point",
        "position": "month*revenue",
        "size": 4,
        "shape": "circle",
        "color": "city",
        "style": {
          "stroke": "#fff",
          "lineWidth": 1
        }
      }
    ],
    "Tooltip": {
      "crosshairs": {
        "type": "y"
      }
    }
  }
}

const barChartConfig = {
  "title": "柱状图",
  "alias": "barChartData",
  "colProps": {
    "span": 12
  },
  "height": 400,
  "scale": {
    "sales": {
      "tickInterval": 20
    }
  },
  "content": {
    "Coord": [],
    "Axis": [
      {
        "name": "year"
      },
      {
        "name": "sales"
      }
    ],
    "Geom": [
      {
        "type": "interval",
        "position": "year*sales"
      }
    ],
    "Legend": [],
    "Tooltip": {
      "crosshairs": {
        "type": "y"
      }
    }
  }
}
  

const elementConfig = {
  "type": "HtBChart",
  "props": {
    "formConfig": {
      "url": "/api/xxx/list",
      "isAutoSubmit": false,
      "fields": [
        {
          "field": "business_direction",
          "title": "业务方向",
          "type": "Select",
          "required": true,
          "options": "<%:=  business_direction %>",
          "onChangeRequests": [
            {
              "alias": "business_group_options",
              "url": "/api/business/group",
              "params": {
                "business_direction": "<%:=  $$HtChartForm.business_direction %>"
              }
            }
          ],
          "setFieldValues": [
            {
              "field": "business_group",
              "value": undefined
            },
            {
              "field": "business_line",
              "value": undefined
            }
          ]
        },
        {
          "field": "business_group",
          "title": "业务组",
          "type": "Select",
          "options": "<%:=  business_group_options %>",
          "onChangeRequests": [
            {
              "alias": "business_line_options",
              "url": "/api/business/line",
              "params": {
                "business_group": "<%:=  $$HtChartForm.business_group %>"
              }
            }
          ],
          "setFieldValues": [
            {
              "field": "business_line",
              "value": undefined
            }
          ]
        },
        {
          "field": "business_line",
          "title": "业务线",
          "type": "Select",
          "options": "<%:=  business_line_options %>"
        },
        {
          "field": "data_range",
          "title": "时间段",
          "type": "RangePicker"
        }
      ]
    },
    "chartConfig": [lineChartConfig, barChartConfig],
    "tableConfig": {
      "pageSize": 1,
      "columns": [
        {
          "title": "id",
          "dataIndex": "id",
          "width": 50
        },
        {
          "title": "business_direction",
          "dataIndex": "business_direction",
          "width": 80
        },
        {
          "title": "business_group",
          "dataIndex": "business_group",
          "width": 80
        },
        {
          "title": "business_line",
          "dataIndex": "business_line",
          "width": 100
        }
      ] 
    } 
  }
}


ReactDOM.render(<Hetu local={local} remote={remote} elementConfig={elementConfig} />, mountNode)
```
