/**
 * 每周上线报告
 * 数据来源-线上环境
 */

import _ from 'lodash'

type IPage = {
  path: string
  name: string
  create_ucid: string
  create_user_name: string
}

type IOnlineRow = {
  // 上线页面
  pages: IPage[]
  // 上线人
  online_user_name: string
  // 上线时间
  online_time: string
  // 上线备注
  online_remark: string
}

type IProjectOnlineRow = {
  // 项目标识
  project_code: string
  // 项目名
  name: string
  // 项目首页
  home: string
  // 负责人
  create_user_name: string
  // 是否为新项目
  isNew: boolean
  // 上线数据
  onlineData: IOnlineRow[]
}

type ITableRow = {
  departmentName: string
  projects: IProjectOnlineRow[]
}

export type IOnlineData = {}

export type IOnlineWeekOptions = {
  config: {
    title: string
  }
  tableData: ITableRow[]
}

function renderPages(pages: IPage[], maxCounts = 8) {
  if (Array.isArray(pages)) {
    let res = pages
      .slice(0, maxCounts)
      .map((p, i) => `<div class="no-wrap">${i + 1}. ${p.name}</div>`)
      .join('')
    if (pages.length > maxCounts) {
      res += '...'
    }
    return res
  }

  return ''
}

function renderTableBody(tableData: ITableRow[]) {
  let res = ''
  let prevDepartmentName = ''
  let preProjectName = ''

  let departmentMap: any = {}
  let projectMap: any = {}
  for (let x = 0; x < tableData.length; x++) {
    const { departmentName, projects } = tableData[x]
    let total = 0
    for (let y = 0; y < projects.length; y++) {
      const { project_code, onlineData } = projects[y]
      projectMap[project_code] = onlineData.length
      total += onlineData.length
    }
    departmentMap[departmentName] = total
  }

  for (let l = 0; l < tableData.length; l++) {
    const { departmentName, projects } = tableData[l]
    for (let i = 0; i < projects.length; i++) {
      const v = projects[i]
      const onlineData = v.onlineData

      for (let j = 0; j < onlineData.length; j++) {
        let rowStr = ''
        if (prevDepartmentName !== departmentName) {
          prevDepartmentName = departmentName
          let departmentRowspan = departmentMap[departmentName]
          rowStr += `<td class="no-wrap" rowspan="${departmentRowspan}">${departmentName}</td>`
        }
        if (preProjectName !== v.name) {
          preProjectName = v.name
          const projectRowspan = projectMap[v.project_code]
          rowStr += `<td rowspan="${projectRowspan}">${v.project_code}</td>
          <td rowspan="${projectRowspan}">
          ${v.name}
          ${v.isNew ? '<span style="color:red;">(新)</span>' : ''}
          </td>
          <td rowspan="${projectRowspan}">${v.create_user_name}</td>`
        }
        rowStr += `<td class="no-wrap">${onlineData[j].online_time}</td>
        <td>${onlineData[j].online_user_name}</td>
        <td>${onlineData[j].online_remark}</td>
        <td class="align-left">${renderPages(onlineData[j].pages)}</td>`
        res += `<tr>${rowStr}</tr>`
      }
    }
  }
  return res
}

export default function render(options: IOnlineWeekOptions) {
  const { tableData, config } = options
  if (!Array.isArray(tableData)) {
    throw new TypeError(`options must be an Array, but got ${typeof tableData}`)
  }

  if (tableData.length === 0) {
    return `暂无数据`
  }

  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,height=device-height">
        <title>${config.title}</title>
        <style type="text/css">
        body{
          padding:20px 15px 20px 20px;
          background-color: #fff;
        }
        table {
            width: 1000px;
            margin: 10px auto;
            font-family: verdana,arial,sans-serif;
            font-size:12px;
            color:#333333;
            border-width: 1px;
            border-color: #c1c7d0;
            border-collapse: collapse;
            text-align: center;
        }
        table th {
            border-width: 1px;
            padding: 8px;
            border-style: solid;
            border-color: #c1c7d0;
            color: #000;
            background-color: #f4f5f7;
        }
        table thead th {
          font-size:14px; 
          padding:16px 8px;
        }
        table td {
            min-width: 100px;
            border-width: 1px;
            padding: 12px 8px;
            border-style: solid;
            border-color: #c1c7d0;
            word-break: break-all;
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
              <th colspan="9">${config.title}</th>
            </tr>
            <tr>
              <th>业务线</th>
              <th>项目标识</th>
              <th>项目名</th>
              <th>负责人</th>
              <th>上线时间</th>
              <th>上线人</th>
              <th>上线备注</th>
              <th>上线页面详情</th>
            </tr>
          </thead>
          <tbody>
            ${renderTableBody(tableData)}
          </tbody>         
        </table>      
      </body>
      </html>
    `
}
