//logs.js
var app = getApp();

Page({
  data: {
    oprateList: [
      {
        type: 'isCollect',
        selected: 'ri-heart-fill',
        select: 'ri-heart-line',
      },
      {
        type: 'isBlacklist',
        selected: 'ri-user-unfollow-fill',
        select: 'ri-user-add-line',
      },
      {
        type: 'isComplaint',
        selected: 'ri-shield-star-fill',
        select: 'ri-shield-star-line',
      },
    ],
    detailData: {},
    reviceIndustryName: '',
    options: {},
    showOprate: false,
  },
  onLoad(options) {
    this.setData({
      options,
      showOprate: options.skipFrom !== 'release',
    });
    this.getDetail();
  },
  getDetail() {
    const { type, id } = this.data.options;
    const obj = {
      industryNews: 'industryNewsId',
      recruitmentNews: 'recruitmentNewsId',
    };
    wx.$http.post(`${type}/findById`, { [obj[type]]: id }).then(
      (res) => {
        const detailData = res[type] || {};
        const reviceIndustryName = (detailData.receiveIndustryList || []).map(d => d.industryName).join('、');
        this.setData({ detailData, reviceIndustryName });
      },
      () => { },
    );
  },
  // 收藏、拉黑、举报
  oprate({ currentTarget }) {
    const { type } = currentTarget.dataset;
    const { detailData } = this.data;
    const { id, userId, newsId } = detailData;
    const obj = {
      isBlacklist: {
        'N': {
          url: 'blacklist/save',
          warningTips: '是否将该用户添加至黑名单?',
          successTips: '添加黑名单成功',
          params: {
            blackUserId: userId,
          },
        },
        'Y': {
          url: 'blacklist/delete',
          successTips: '黑名单已取消',
          params: {
            blackUserId: userId,
          },
        },
      },
      isCollect: {
        'N': {
          url: 'collection/save',
          successTips: '收藏成功',
          params: {
            newsId: id || newsId,
          },
        },
        'Y': {
          url: 'collection/delete',
          successTips: '已取消收藏',
          params: {
            newsId: id || newsId,
          },
        },
      },
      isComplaint: {
        'N': {
          url: 'complaint/submit',
          warningTips: '是否举报该用户?',
          successTips: '举报成功',
          params: {
            newsId: id || newsId,
          },
        },
      }
    };
    const currentState = detailData[type] || 'N';
    if (!obj[type][currentState]) return;

    const url = obj[type][currentState].url;
    const params = obj[type][currentState].params;
    const successTips = obj[type][currentState].successTips;
    const warningTips = obj[type][currentState].warningTips;

    if (warningTips) {
      app.showModal({ content: obj[type][currentState].warningTips }).then(
        () => {
          this.handlerOprate({ url, params, successTips });
        },
        () => { },
      );
      return;
    }
    this.handlerOprate({ url, params, successTips });
  },
  handlerOprate({ url, params, successTips }) {
    wx.$http.post(url, params).then(
      () => {
        wx.showToast({ title: successTips });
        setTimeout(() => {
          this.getDetail();
        }, 1000);
      },
      () => { },
    );
  },
  onUnload() {
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.selectComponent('#comon-page').getList();
  },
})
