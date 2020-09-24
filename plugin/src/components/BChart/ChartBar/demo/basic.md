---
order: 0
title: 基础柱状图
---

* [数据源](http://mockjs.docway.net/mock/1XhtOi6ISFV/api/chart/bar)

```jsx
import Hetu from 'hetu'

const elementConfig = {
  "type": "HtBChart",
  "props": {
    "formConfig": {
      "url": "/api/chart/bar",
      "fields": [],
    },
    "chartConfig": [{
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
    }]
  }
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
