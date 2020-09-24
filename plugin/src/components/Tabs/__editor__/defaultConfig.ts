export default {
  type: 'HtTabs',
  props: {
    tabsType: 'line',
    defaultActiveKey: 'tab2',
    tabs: [
      {
        title: 'tab-1',
        value: 'tab1',
        showIndexs: [0],
      },
      {
        title: 'tab-2',
        value: 'tab2',
        showIndexs: [0],
      },
    ],
    content: [
      {
        type: 'HtList',
        props: {
          url: '/mock/api/list',
          fields: [
            {
              field: 'id',
              title: 'bannerId',
            },
            {
              field: 'tags',
              title: '标签',
            },
          ],
          columns: [
            {
              title: 'id',
              dataIndex: 'id',
              width: 60,
            },
            {
              title: 'text',
              dataIndex: 'text',
              width: 200,
            },
            {
              title: '操作',
              width: 120,
              operations: [
                {
                  text: '查看',
                  actionType: 'open',
                  url: 'http://aaa.com',
                },
                {
                  text: '编辑',
                  actionType: 'modalForm',
                  url: '/mock/api/update',
                  fields: [
                    {
                      field: 'imageUrl',
                      title: 'banner',
                    },
                    {
                      field: 'tags',
                      title: '标签',
                    },
                  ],
                },
                {
                  text: '删除',
                  actionType: 'xhr',
                  url: '/mock/api/xxx/delete',
                },
              ],
            },
          ],
          transform:
            '<%:= data => ({...data, activeTab: $$HtTabs.activeTab }) %>',
          pageSize: 2,
        },
        children: [],
      },
    ],
  },
}
