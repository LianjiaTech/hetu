---
order: 0
title: 基础饼图
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
        title: '基础饼图',
        tooltip: '这是一个饼图的提示信息',
        height: 400,
        content: {
          Legend: [],
          Coord: [
            {
              type: 'theta',
            },
          ],
          Tooltip: [
            {
              showTitle: false,
            },
          ],
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
