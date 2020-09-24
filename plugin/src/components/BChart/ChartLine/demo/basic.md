---
order: 0
title: 基础折线图
---

* [数据源](http://mockjs.docway.net/mock/1XhtOi6ISFV/api/chart/line/basic)
* [试炼场](https://bizcharts.net/products/bizCharts/demo/detail?id=line-basic&selectedKey=%E6%8A%98%E7%BA%BF%E5%9B%BE)

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtBChart",
  "props": {
    "formConfig": {
      "url": "/api/chart/line/basic",
      "fields": []
    },
    "chartConfig": [{
      "title": "基础折线图",
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
      }
    }] 
  }
}


ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
