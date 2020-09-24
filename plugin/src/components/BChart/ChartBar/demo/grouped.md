---
order: 2
title: 分组柱状图
---

- [数据源](http://mockjs.docway.net/mock/1XhtOi6ISFV/chart/bar/2)

```jsx
import Hetu from 'hetu'

const elementConfig = {
    "type": "HtBChart",
    "props": {
      "isCard": true,
      "formConfig": {
        "url": "/chart/bar/2",
        "fields": [
          {
            "field": "year",
            "title": "年代",
            "type": "Select",
            "options": [
              "2019",
              "2018"
            ]
          },
          {
            "field": "name",
            "title": "降雨量",
            "type": "Input",
            "defaultValue": "<%:= $$HtChartResponse.data[0]['月均降雨量'] %>"
          }
        ]
      },
      "chartConfig": [
        {
          "height": 400,
          "scale": {},
          "content": {
            "Legend": [
              {}
            ],
            "Axis": [
              {
                "name": "月份"
              },
              {
                "name": "月均降雨量"
              }
            ],
            "Geom": [
              {
                "type": "interval",
                "position": "月份*月均降雨量",
                "color": "name",
                "adjust": [
                  {
                    "type": "dodge",
                    "marginRatio": "<%:=  1 / 32 %>"
                  }
                ]
              }
            ],
            "Tooltip": {
              "crosshairs": {
                "type": "y"
              }
            }
          }
        }
      ]
    }
  }

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
