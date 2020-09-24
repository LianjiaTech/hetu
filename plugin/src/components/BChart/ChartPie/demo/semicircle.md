---
order: 1
title: 角度饼图
---

- [数据源](http://mockjs.docway.net/mock/1XhtOi6ISFV/api/chart/line/basic)
- [试炼场](https://bizcharts.net/products/bizCharts/demo/detail?id=line-basic&selectedKey=%E6%8A%98%E7%BA%BF%E5%9B%BE)

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtBChart',
  props: {
    formConfig: {
      url: '/api/chart/line/basic',
      fields: [],
    },
    chartConfig: [
      {
        title: '角度饼图',
        height: 400,
        padding: [40, 0],
        content: {
          Coord: [
            {
              type: 'theta',
              startAngle: Math.PI,
              endAngle: Math.PI * (3 / 2),
            },
          ],
          Tooltip: [],
          Geom: [
            {
              type: 'intervalStack',
              position: 'value',
              color: 'year',
              Label: [
                {
                  content: 'year',
                },
              ],
            },
          ],
        },
      },
    ],
  },
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
