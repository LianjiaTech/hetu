/**
 * 每周提效统计
 * 数据来源-测试环境
 */

import _ from 'lodash'

type IUser = {
  user_name: string
  user_id: string
  role: string
}

type ITableConfig = {
  // 表格标题
  title: string
  // 总项目数
  projectsTotal?: number
  // 页面总数
  pagesTotal?: number
  // 新增页面总数
  newPagesTotal?: number
  // 新增项目
  newProjectTotal?: number
}

type ITableRow = {
  // 排名
  index: number
  // 部门名
  departmentName: string
  // 项目标识
  project_code: string
  // 项目名
  name: string
  // 首页
  home: string
  // 负责人
  create_user_name: string
  // 是否为新项目
  isNew: boolean
  // 项目成员
  users: IUser[]
  // 总页面数
  pagesTotal: number
  // 新增页面数
  newPagesTotal: number
  // 发布次数
  publishCounts: number
}

type ITableOption = {
  config: ITableConfig
  tableData: ITableRow[]
}

type IOptionsConfig = {
  // 总项目数
  projectsTotal: number
  // 页面总数
  pagesTotal: number
  // 新增项目
  newProjectTotal: number
  // 新增页面
  newPagesTotal: number
}

export type IDevelopmentOptions = {
  config: IOptionsConfig
  data: ITableOption[]
}

function renderUsers(users: IUser[], maxCounts = 8) {
  if (Array.isArray(users)) {
    let res = users
      .slice(0, maxCounts)
      .map((u) => u.user_name)
      .join(',')
    if (users.length > maxCounts) {
      res += '...'
    }
    return res
  }

  return ''
}

function renderTableBody(tableData: ITableRow[], config: ITableConfig) {
  let res = ` <table>
  <thead>
    <tr>
      <td colspan="8" style="padding: 16px;font-size: 16px;">
        <span class="blod">${config.title}</span>
        ${
          config.pagesTotal
            ? `<span style="padding: 0 30px">
        提效页面总数: <span class="red">${config.pagesTotal}</span>
        </span>`
            : ''
        }
    </tr>
  </thead>
  <tbody>
      <tr>
        <th>排名</th>
        <th>项目标识</th>
        <th>项目名</th>
        <th>负责人</th>
        <th>项目成员</th>
        <th>提效页面总数</th>
        <th>新增页面数</th>
        <th>发布次数</th>
      </tr>
      ${tableData
        .map((v, index) => {
          return `
            <tr>
              <td>${index + 1}</td>
              <td>${v.project_code}</td>
              <td class="no-wrap">
                ${v.name}
                ${v.isNew ? '<span style="color:red;">(新)</span>' : ''}
              </td>
              <td>${v.create_user_name}</td>
              <td>${renderUsers(v.users)}</td>
              <td>${v.pagesTotal}</td>
              <td>${v.newPagesTotal}</td>
              <td>${v.publishCounts}</td>
            </tr> 
          `
        })
        .join('')}
  </tbody>
</table>`

  return res
}

export default function render(options: IDevelopmentOptions) {
  const { config, data } = options
  if (!Array.isArray(data)) {
    throw new TypeError(`options must be an Array, but got ${typeof data}`)
  }

  if (data.length === 0) {
    return `暂无数据`
  }

  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,height=device-height">
        <title>河图提效数据</title>
        <style type="text/css">
        body {
          padding: 20px 15px 20px 20px;
          background-color: #fff;
        }
    
        table {
          width: 1000px;
          margin: 10px auto;
          font-family: verdana, arial, sans-serif;
          font-size: 13px;
          color: #333333;
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
          font-size: 14px;
          padding: 16px 8px;
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
    
        .align-center {
          text-align: center;
        }
    
        .no-wrap {
          white-space: nowrap;
        }
    
        .blod {
          font-weight: blod;
        }
    
        .statistic-container {
          display: flex;
          margin-bottom: 30px;
        }
    
        .statistic {
          flex: 1;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          color: rgba(0, 0, 0, .65);
          font-size: 14px;
          font-variant: tabular-nums;
          line-height: 1.5715;
          list-style: none;
          font-feature-settings: "tnum", "tnum";
          text-align: center;
        }
    
        .statistic-title {
          margin-bottom: 4px;
          color: rgba(0, 0, 0, .45);
          font-size: 14px;
        }
    
        .statistic-content {
          color: rgba(0, 0, 0, .85);
          font-size: 24px;
          margin: 0;
        }
    
        .red {
          color: red;
        }
        </style>
      </head>
      <body>
        <div class="statistic-container">
          <div class="statistic">
            <div class="statistic-title">提效项目总数</div>
            <p class="statistic-content">${config.projectsTotal}</p>
          </div>
          <div class="statistic">
            <div class="statistic-title">提效页面总数</div>
            <p class="statistic-content">${config.pagesTotal}</p>
          </div>
          <div class="statistic">
            <div class="statistic-title">本周新增项目</div>
            <p class="statistic-content red">${config.newProjectTotal}</p>
          </div>
          <div class="statistic">
            <div class="statistic-title">本周新增页面</div>
            <p class="statistic-content red">${config.newPagesTotal}</p>
          </div>
        </div>  
  
        ${data.map((v) => renderTableBody(v.tableData, v.config)).join('<br/>')}
      </body>
      </html>
    `
}
