export default {
  route: '/project/template/chart/line',
  title: '多条折线图',
  remote: {},
  elementConfig: {
    type: 'HtBChart',
    props: {
      isCard: true,
      formConfig: {
        url: '/mock/api/chart/line/series',
        fields: [
          {
            field: 'year',
            title: '年代',
            type: 'Select',
            options: ['2019', '2018'],
          },
        ],
      },
      chartConfig: [
        {
          height: 400,
          scale: {
            month: {
              range: [0, 1],
            },
          },
          content: {
            Legend: [{}],
            Axis: [
              {
                name: 'month',
              },
              {
                name: 'revenue',
              },
            ],
            Geom: [
              {
                type: 'line',
                position: 'month*revenue',
                size: 2,
                color: 'city',
              },
              {
                type: 'point',
                position: 'month*revenue',
                size: 4,
                shape: 'circle',
                color: 'city',
                style: {
                  stroke: '#fff',
                  lineWidth: 1,
                },
              },
            ],
            Tooltip: {
              crosshairs: {
                type: 'y',
              },
            },
          },
        },
      ],
    },
  },
}
