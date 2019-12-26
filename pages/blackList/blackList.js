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
          loadingWord: !list.length ? '暂无数据' : list.length < total ? '上拉加载更多' : '已全部加载',
        });
      },
      () => { },
    );
  },
  remove({ currentTarget }) {
    const { item } = currentTarget.dataset;
    app.showModal({ content: `是否将${item.blackName || '该用户'}从黑名单列表移除?` }).then(() => {
      wx.$http.post('blacklist/delete', { blackUserId: item.blackUserId }).then(
        () => {
          wx.showToast({ title: '黑名单已移除', mask: true });
          setTimeout(() => {
            this.initList();
          }, 1000);
        },
        () => { },
      );
    });
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