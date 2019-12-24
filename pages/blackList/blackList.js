// pages/user/user.js
const app = getApp()

Page({
  data: {
    blackName: '',
    blackList: [],
    pageSize: 20,
    loadingWord: '',
  },
  onLoad: function () {
    this.initList();
  },
  clearInput() {
    this.setData({ blackName: '' });
    this.initList();
  },
  search({ detail }) {
    const { value: blackName } = detail;
    this.setData({ blackName });
    this.initList();
  },
  getList() {
    const { pageSize, blackName } = this.data;
    this.setData({ loadingWord: '正在加载' });
    wx.$http.post('blacklist/list', { pageNum: 1, pageSize, blackName }).then(
      ({ list, total }) => {
        const blackList = list || [];
        this.setData({
          blackList,
          loadingWord: list.length < total ? '上拉加载更多' : '已全部加载',
        });
      },
      () => { },
    );
  },
  initList() {
    const { blackName } = this.data;
    this.setData({
      blackName,
      pageSize: 10,
    });
    this.getList();
  },
  getNextPage() {
    let { pageSize } = this.data;
    pageSize += 10;
    this.setData({ pageSize });
    this.getList();
  },
  onReachBottom: function () {
    this.getNextPage();
  },
})