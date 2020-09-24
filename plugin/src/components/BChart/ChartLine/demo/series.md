---
order: 2
title: 多条折线图
---

* [数据源](http://mockjs.docway.net/mock/1XhtOi6ISFV/api/chart/line/series)
* [试炼场](https://bizcharts.net/products/bizCharts/demo/detail?id=line-basic&selectedKey=%E6%8A%98%E7%BA%BF%E5%9B%BE)

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtBChart",
  "props": {
    "formConfig": {
      "url": "/api/chart/line/series",
      "fields": [
        {
          "field": "year",
          "title": "年代",
          "type": "Select",
          "options": ["2019","2018"]
        }
      ]
    },
    "chartConfig": [{
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
    }] 
  }
}


ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
