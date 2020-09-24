---
order: 4
title: 双层饼图
---

- [数据源](http://mockjs.docway.net/mock/1XhtOi6ISFV/api/chart/doublePie)
- [试炼场](https://bizcharts.net/products/bizCharts/demo/detail?id=line-basic&selectedKey=%E6%8A%98%E7%BA%BF%E5%9B%BE)

```jsx
import Hetu from 'hetu'

const elementConfig = {
  type: 'HtBChart',
  props: {
    formConfig: {
      url: '/api/chart/doublePie',
      fields: [],
    },
    chartConfig: [
      {
        alias: 'chart1',
        title: '双层饼图',
        height: 400,
        scale: {
          percent: {
            formatter: "<%:= val => (val*100).toFixed(2) + '%' %>",
          },
        },
        content: {
          Coord: [
            {
              type: 'theta',
              radius: 0.5,
            },
          ],
          Tooltip: {
            showTitle: false,
            itemTpl:
              '<li><span style=&quotbackground-color:{color};&quot;class=&quot;g2-tooltip-marker&quot></span>{name}: {percent}</li>',
          },
          Geom: [
            {
              type: 'intervalStack',
              position: 'percent',
              color: 'type',
              tooltip: [
                'type*percent',
                "<%:=  (name,percent) => ({name,percent:(percent*100).toFixed(2)+'%'}) %>",
              ],
              Label: [
                {
                  content: 'type',
                  offset: -10,
                },
              ],
              style: [
                {
                  lineWidth: 1,
                  stroke: '#fff',
                },
              ],
              select: false,
            },
          ],
          View: [
            {
              alias: 'chart2',
              scale: {
                percent: {
                  formatter: "<%:= val => (val*100).toFixed(2) + '%' %>",
                },
              },
              content: {
                Coord: [
                  {
                    type: 'theta',
                    radius: 0.75,
                    innerRadius: 0.5 / 0.75,
                  },
                ],
                Geom: [
                  {
                    type: 'intervalStack',
                    position: 'percent',
                    color: [
                      'name',
                      [
                        '#BAE7FF',
                        '#7FC9FE',
                        '#71E3E3',
                        '#ABF5F5',
                        '#8EE0A1',
                        '#BAF5C4',
                      ],
                    ],
                    tooltip: [
                      'name*percent',
                      "<%:=  (name,percent) => ({name,percent:(percent*100).toFixed(2)+'%'}) %>",
                    ],
                    style: [
                      {
                        lineWidth: 1,
                        stroke: '#fff',
                      },
                    ],
                    select: false,
                    Label: [
                      {
                        content: 'name',
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
}

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
