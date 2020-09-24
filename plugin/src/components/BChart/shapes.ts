import { Shape } from 'bizcharts'

if (Shape.registerShape) {
  Shape.registerShape('point', 'gauge', {
    drawShape(cfg: any, group: any) {
      let point = cfg.points[0] // 获取第一个标记点
      // @ts-ignore
      point = this.parsePoint(point)
      // @ts-ignore
      const center = this.parsePoint({
        // 获取极坐标系下画布中心点
        x: 0,
        y: 0,
      })
      // 绘制指针
      group.addShape('line', {
        attrs: {
          x1: center.x,
          y1: center.y,
          x2: point.x,
          y2: point.y - 20,
          stroke: cfg.color,
          lineWidth: 5,
          lineCap: 'round',
        },
      })
      // 绘制圆
      return group.addShape('circle', {
        attrs: {
          x: center.x,
          y: center.y,
          r: 12,
          stroke: cfg.color,
          lineWidth: 4.5,
          fill: '#fff',
        },
      })
    },
  })
}
