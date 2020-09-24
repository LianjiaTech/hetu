---
order: 4
title: 一份数据, 多种图表
---

* [数据源](http://mockjs.docway.net/mock/1XhtOi6ISFV/api/chart/line/basic_1569826619574)
- alias 设置数据来源的字段

- `colProps` 栅栏布局属性, 共24格
  - `offset` 栅格左侧的间隔格数
  - `span` 栅格占位格数
  - `pull` 栅格向左移动格数
  - `push` 栅格向右移动格数

```jsx
import Hetu from 'hetu'

const chartConfig1 = {
      "title": "基础折线图",
      "alias": "line",
      "colProps": {
        "span": 12
      },
      "height": 400,
      "sales": {
        "value": {
          "min": 0
        },
        "year": {
          "range": [0, 1]
        }
      },
      "content": {
        "Legend": [{}],
        "Axis": [
          {"name": "year"}, { "name": "value"}
        ],
        "Geom": [
          { 
            "type": "line",
            "position": "year*value",
            "size": 2
          },
          {
            "type": "point",
            "position": "year*value",
            "size": 4,
            "shape": "circle",
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
      },
    } 

const chartConfig2 = {
      "title": "基础柱状图",
      "alias": "bar",
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
      "url": "/api/chart/line/basic_1569826619574",
      "fields": []
    },
    "chartConfig": [chartConfig1, chartConfig2]
  }
}


ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
