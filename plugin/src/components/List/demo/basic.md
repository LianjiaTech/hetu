---
order: 0
title: 简单列表
---

只包含 `表格和分页器` 的简单列表

- `url` 搜索接口地址
- `columns` 配置`标题、字段、宽度`等属性
- `renderType` 设置渲染类型, 支持`a img text`, 默认为 text

```jsx
import Hetu from 'hetu'

const elementConfig = {
        type: 'HtList',
        props: {
          isCard: true,
          extra: [
            {
              type: 'HtModalForm',
              props: {
                url: '/api/form/update',
                fields: [
                  {
                    field: 'name',
                    title: '姓名',
                  },
                  {
                    field: 'age',
                    title: '年龄',
                    type: 'InputNumber',
                  },
                ],
                title: '弹框表单',
                triggerButtonText: '弹框表单',
                triggerButtonProps: {
                  type: 'link',
                },
              },
            },
            {
              type: 'HtButton',
              props: {
                text: '前往下一页',
                href: '/project/template/form/add',
                type: 'link',
              },
            },
          ],
          url: '/api/demo/list',
          uniqueKey: 'id',
          cols: 3,
          pageSize: 20,
          isAutoSubmit: true,
          "scrollWidth": 800,
          columns: [
            {
              title: 'id',
              dataIndex: 'id',
              width: 60,
            },
            {
              title: '性别',
              dataIndex: 'sex_name',
              width: 60,
            },
            {
              title: '姓名',
              dataIndex: 'name',
              width: 100,
            },
            {
              title: '头像',
              dataIndex: 'avatar',
              renderType: 'img',
              width: 100,
            },
            {
              title: '人物介绍',
              dataIndex: 'remark',
              width: 300,
            },
            {
              title: '操作',
              width: 160,
              renderType: 'operations',
              fixed: true,
              operations: [
                {
                  text: '跳转',
                  actionType: 'open',
                  url: 'https://aaa.com',
                  transform: '<%:=  (row) => ({ id: row.id }) %>',
                },
                {
                  text: '删除',
                  actionType: 'xhr',
                  url: '/api/xxx/delete',
                },
              ],
              operations2: [
                {
                  text: '编辑',
                  url: '<%:= row => `/api/form/update/${row.id}` %>',
                  width: 600,
                  fields: [
                    {
                      field: 'id',
                      title: 'id',
                      disabled: true
                    },
                    {
                      field: 'name',
                      title: '姓名'
                    },
                    {
                      field: 'sex',
                      title: '性别',
                      type: 'Radio',
                      options: [
                        {
                          label: '男',
                          value: 1
                        },
                        {
                          label: '女',
                          value: 0
                        }
                      ]
                    },
                    {
                      field: 'avatar',
                      title: '头像',
                      type: 'Upload',
                      extra: '最多上传2张图片',
                      max: 2,
                      maxSize: 10000,
                      defaultValue: [],
                      uploadProps: {
                        action: '/api/upload',
                        accept: '.jpg, .bmp, .png, .pdf',
                        listType: 'picture',
                      }
                    },
                    {
                      field: 'remark',
                      title: '人物介绍',
                      type: 'Input.TextArea',
                      rows: 4
                    }
                  ],
                },
              ],
            },
          ],
          
          fields: [
            {
              type: 'Input',
              field: 'name',
              title: '姓名',
              placeholder: '',
              tooltip: '',
              defaultValue: '',
              required: false,
              disabled: false,
            },
          ],
          alias: '$$HtList',
          buttons: ['submit', 'reset'],
        },
      }

ReactDOM.render(<Hetu elementConfig={elementConfig} />, mountNode)
```
