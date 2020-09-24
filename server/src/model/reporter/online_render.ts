/**
 * 上线报告
 * 数据来源-线上环境
 */

import _ from 'lodash'

type IPage = {
  path: string
  name: string
  create_ucid: string
  create_user_name: string
}

export type IOnlineData = {
  // 标题
  title: string
  // 项目标识
  project_code: string
  // 首页
  home?: string
  // 项目名
  name: string
  // 上线页面
  pages: IPage[]
  // 上线人
  online_user: string
  // 上线时间
  time: string
  // 备注
  remark: string
}

export default function render(v: IOnlineData) {
  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,height=device-height">
        <title>${v.title}</title>
        <style type="text/css">
        body{
          padding:20px 15px 20px 20px;
          background-color: #fff;
        }
        table {
            width: 600px;
            margin: 0 auto;
            font-family: verdana,arial,sans-serif;
            font-size:12px;
            color:#333333;
            border-width: 1px;
            border-color: #c1c7d0;
            border-collapse: collapse;
            text-align: center;
        }
        table th {
            width: 200px;
            white-space: nowrap;
            border-width: 1px;
            font-size: 14px;
            padding: 12px;
            border-style: solid;
            border-color: #c1c7d0;
            color: #000;
            background-color: #f4f5f7;
        }
        table td {
            min-width: 100px;
            border-width: 1px;
            padding: 12px;
            border-style: solid;
            border-color: #c1c7d0;
        }
        .align-left {
          text-align: left;
        }
        .no-wrap {
          white-space: nowrap;
        }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th colspan="2">上线报告</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <th>项目标识</th>
                <td>${v.project_code}</td>
              </tr>
              <tr>
                <th>项目名称</th>
                <td>
                  ${v.name}
                </td>
              </tr>
              <tr>
                <th>上线人</th>
                <td>${v.online_user}</td>
              </tr>
              <tr>
                <th>上线时间</th>
                <td>${v.time}</td>
              </tr>
              <tr>
                <th>上线页面</th>
                <td>
                  <div>
                    ${
                      Array.isArray(v.pages)
                        ? v.pages
                            .map(
                              (p, i) =>
                                `<div style="padding-left: 100px; width: 200px; text-align: left; margin: auto;">${
                                  i + 1
                                }. p.name</div>`,
                            )
                            .join('')
                        : ''
                    }
                  </div>
                </td>
              </tr>
            
              <tr>
                <th>备注</th>
                <td>${v.remark}</td>
              </tr>
          </tbody>
        </table>
      </body>
      </html>
    `
}
