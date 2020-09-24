---
order: 2
title: 空心饼图
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
        title: '空心饼图',
        height: 400,
        content: {
          Coord: [
            {
              type: 'theta',
              innerRadius: 0.75,
            },
          ],
          Tooltip: [
            {
              showTitle: false,
            }
          ],
          Geom: [
            {
              type: 'intervalStack',
              position: 'value',
              color: 'year',
              shape: 'sliceShape',
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
