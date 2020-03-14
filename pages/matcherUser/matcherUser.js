// pages/user/user.js
const app = getApp()

Page({
  data: {
    keyword: '',
    companyList: [],
    pageSize: 20,
    loadingWord: '',
    industryNewsId: '',
  },
  onLoad: function ({ industryNewsId }) {
    this.setData({ industryNewsId });
    this.initList();
  },
  clearInput() {
    this.setData({ keyword: '' });
    this.initList();
  },
  search({ detail }) {
    const { value: keyword } = detail;
    this.setData({ keyword });
    this.initList();
  },
  getList() {
    const { pageSize, keyword, industryNewsId } = this.data;
    this.setData({ loadingWord: '正在加载' });
    wx.$http.post('industryNews/lookMatcherUser', { pageNum: 1, pageSize, keyword, industryNewsId }).then(
      ({ list, total }) => {
        const companyList = (list || []).map(d => ({
          ...d,
          iconName: d.userType[0],
        }));
        this.setData({
          companyList,
          loadingWord: !list.length ? '暂无数据' : list.length < total ? '上拉加载更多' : '已全部加载',
        });
      },
      () => { },
    );
  },
  initList() {
    const { keyword } = this.data;
    this.setData({
      keyword,
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
  viewCompany({ currentTarget }) {
    const { item } = currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/viewUserInfo/viewUserInfo?userId=${item.userId}`,
    });
  },
  update() {
    const { industryNewsId } = this.data;
    wx.$http.post('industryNews/matcherUserRefresh', { industryNewsId }).then(
      () => {
        this.initList();
      },
      () => { },
    );
  },
  onReachBottom: function () {
    this.getNextPage();
  },
})