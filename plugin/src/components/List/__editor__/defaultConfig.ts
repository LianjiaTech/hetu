export default {
  type: 'HtList',
  props: {
    url: '/mock/api/list',
    pageSize: 2,
    columns: [
      {
        title: 'id',
        dataIndex: 'id',
        width: 50,
        tooltip: '你好',
      },
      {
        title: 'banner',
        dataIndex: 'imageUrl',
        width: 60,
        renderType: 'img',
        sort: true,
      },
      {
        title: '预览链接',
        dataIndex: 'preview',
        width: 80,
        renderType: 'a',
      },
      {
        title: '标签',
        dataIndex: 'tags',
        renderType: 'tag',
        width: 100,
        isWrapper: true,
      },
      {
        title: '开关',
        dataIndex: 'switch',
        renderType: 'switch',
        url: '/mock/api/update',
        width: 100,
      },
    ],
    cardType: 'plain',
  },
  children: [],
}
