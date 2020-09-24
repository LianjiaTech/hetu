export default {
  route: '/project/template/list/with/gui',
  title: '人物角色管理',
  local: {},
  remote: {},
  elementConfig: {
    type: 'HtGuiContainer',
    props: {},
    children: [
      {
        type: 'HtList',
        props: {
          isCard: true,
          extra: [
            {
              type: 'HtButton',
              props: {
                text: '新建人物',
                href: '/project/template/form/add',
                type: 'link',
              },
            },
            {
              type: 'HtModalForm',
              props: {
                url: '/mock/api/update',
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
                type: 'primary',
              },
            },
          ],
          url: '/mock/api/demo/list',
          uniqueKey: 'id',
          cols: 3,
          pageSize: 20,
          isAutoSubmit: true,
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
              renderType: 'operations_new',
              fixed: true,
              operations: [
                {
                  text: '跳转',
                  actionType: 'jump',
                  url: '/xxx/edit',
                  transform: '<%:= (row) => ({ ...row }) %>',
                },
                {
                  text: '删除',
                  actionType: 'xhr',
                  url: '/xxx/delete',
                },
              ],
              operations3: [
                {
                  type: 'HtModalForm',
                  __noRender: true,
                  props: {
                    triggerButtonText: '弹框',
                    title: '编辑',
                    width: 516,
                    top: 100,
                    url: '/mock/api/update',
                    method: 'post',
                    fields: [
                      {
                        field: 'name',
                        title: '姓名',
                        type: 'Input',
                        disabled: false,
                        required: true,
                      },
                    ],
                    buttons: ['cancel', 'submit'],
                    transform: '<%:= (row, data) => ({  ...row, ...data }) %>',
                    'v-if': '<%:= row => true %>',
                    buttonType: 'primary',
                    cols: 1,
                    alias: '$$HtModalForm',
                    type: 'HtModalForm',
                  },
                  children: [],
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
      },
    ],
  },
}
