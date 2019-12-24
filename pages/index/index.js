//logs.js
var app = getApp();

Page({
  data: {
    visible: false,
    tabs: [
      {
        name: '招聘消息',
        code: 'industryNews',
        icon: 'zp.png',
      },
      {
        name: '行业消息',
        code: 'recruitmentNews',
        icon: 'hy.png',
      },
    ],
    type: 'industryNews',
    title: '',
    msgList: [],
    pageSize: 20,
    loadingWord: '',
  },
  clearInput() {
    this.setData({ title: '' });
    this.initList();
  },
  search({ detail }) {
    const { value: title } = detail;
    this.setData({ title });
    this.initList();
  },
  tabsChange({ detail }) {
    const { code: type } = detail;
    this.setData({ type });
    this.initList();
  },
  getList() {
    const obj = {
      industryNews: 'industryNews/list',
      recruitmentNews: 'recruitmentNews/list',
    };
    const { type, title } = this.data;
    this.hiddenDel()
    this.setData({ loadingWord: '正在加载' });
    wx.$http.post(obj[type], {
      pageNum: 1,
      pageSize: 10,
      title,
    }).then(
      ({ list, total }) => {
        const msgList = list || [];
        this.setData({
          msgList,
          loadingWord: list.length < total ? '上拉加载更多' : '已全部加载',
        });
      },
      () => { },
    );
  },
  oprate({ detail }) {
    this.hiddenDel()
    const { item, type, index } = detail;

    const obj = {
      isBlacklist: {
        'N': {
          url: 'blacklist/save',
          warningTips: '是否将该用户添加至黑名单?',
          successTips: '添加黑名单成功',
          params: {
            blackUserId: item.id,
          },
        },
        'Y': {
          url: 'blacklist/delete',
          successTips: '黑名单已取消',
          params: {
            blackUserId: item.id,
          },
        },
      },
      isCollection: {
        'N': {
          url: 'collection/save',
          successTips: '收藏成功',
          params: {
            newsId: item.id,
          },
        },
        'Y': {
          url: 'collection/delete',
          successTips: '已取消收藏',
          params: {
            newsId: item.id,
          },
        },
      },
      isComplaint: {
        'N': {
          url: 'complaint/submit',
          warningTips: '是否举报该用户?',
          successTips: '举报成功',
          params: {
            newsId: item.id,
          },
        },
      }
    };
    const currentState = item[type] || 'N';
    if (!obj[type][currentState]) return;

    const url = obj[type][currentState].url;
    const params = obj[type][currentState].params;
    const successTips = obj[type][currentState].successTips;
    const warningTips = obj[type][currentState].warningTips;

    if (warningTips) {
      app.showModal({ content: obj[type][currentState].warningTips }).then(
        () => {
          wx.$http.post(url, params).then(
            () => {
              wx.showToast({ title: successTips });
              const msgList = this.data.msgList.map((d, i) => ({
                ...d,
                [type]: currentState === 'N' && i === index ? 'Y' : 'N',
              }))
              this.setData({ msgList });
            },
            () => { },
          );
        },
        () => {},
      );
      return;
    }

    wx.$http.post(url, params).then(
      () => {
        wx.showToast({ title: successTips });
        const msgList = this.data.msgList.map((d, i) => ({
          ...d,
          [type]: currentState === 'N' && i === index ? 'Y' : 'N',
        }))
        this.setData({ msgList });
      },
      () => { },
    );
  },
  handlerDelete({ detail }) {
    const { item } = detail;
    const { type } = this.data;
    const obj = {
      industryNews: {
        url: 'industryNews/delete',
        params: { industryNewsId: item.id },
      },
      recruitmentNews: {
        url: 'recruitmentNews/delete',
        params: { recruitmentNewsId: item.id },
      },
    };
    app.showModal({ content: '是否删除该条数据' }).then(
      () => {
        wx.$http.post(obj[type].url, obj[type].params).then(
          () => {
            wx.showToast({ title: '删除成功' });
            setTimeout(() => {
              this.getList();
            }, 1000);
          },
          () => {},
        );
      },
      () => {
        this.hiddenDel()
      },
    );
  },
  openDialog() {
    this.setData({ visible: true });
    this.hiddenDel()
  },
  closeDialog() {
    this.setData({ visible: false });
  },
  chooseReleaseType({ currentTarget }) {
    const { code } = currentTarget.dataset;
    wx.navigateTo({ url: `/pages/index/releaseForm/releaseForm?type=${code}` });
    this.setData({ visible: false });
  },
  clickList({ detail }) {
    const { type } = this.data;
    const { id } = detail;
    wx.navigateTo({ url: `/pages/index/messageDetail/messageDetail?type=${type}&id=${id}` });
  },
  viewMsg() {
    wx.navigateTo({ url: '/pages/index/notices/notices' });
  },
  onUnload() {
    this.hiddenDel();
  },
  hiddenDel() {
    if (this.selectComponent('#list')) {
      this.selectComponent('#list').hiddenDel();
    }
  },
  initList() {
    const { title } = this.data;
    this.setData({
      title,
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
