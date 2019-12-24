//logs.js
var app = getApp();

Page({
  data: {
    oprateList: [
      {
        type: 'isCollection',
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
  },
  onLoad(optios) {
    const { type, id } = optios;
    this.getDetail({ type, id });
  },
  getDetail({ type, id }) {
    const params = {};
    const obj = {
      industryNews: 'industryNewsId',
      recruitmentNews: 'recruitmentNewsId',
    };
    wx.$http.post(`${type}/findById`, { [obj[type]]: id }).then(
      (res) => {
        const detailData = res[type] || {};
        const reviceIndustryName = (detailData.reviceIndustryList || []).map(d => d.industryName).join('、');
        this.setData({ detailData, reviceIndustryName });
      },
      () => { },
    );
  },
  oprate({ currentTarget }) {
    const { type } = currentTarget.dataset;
    const { detailData } = this.data;
    const { id } = detailData;

    const obj = {
      isBlacklist: {
        'N': {
          url: 'blacklist/save',
          warningTips: '是否将该用户添加至黑名单?',
          successTips: '添加黑名单成功',
          params: {
            blackUserId: id,
          },
        },
        'Y': {
          url: 'blacklist/delete',
          successTips: '黑名单已取消',
          params: {
            blackUserId: id,
          },
        },
      },
      isCollection: {
        'N': {
          url: 'collection/save',
          successTips: '收藏成功',
          params: {
            newsId: id,
          },
        },
        'Y': {
          url: 'collection/delete',
          successTips: '已取消收藏',
          params: {
            newsId: id,
          },
        },
      },
      isComplaint: {
        'N': {
          url: 'complaint/submit',
          warningTips: '是否举报该用户?',
          successTips: '举报成功',
          params: {
            newsId: id,
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
          wx.$http.post(url, params).then(
            () => {
              wx.showToast({ title: successTips });
              detailData[type] = currentState === 'N' ? 'Y' : 'N';
              this.setData({ detailData });
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
        detailData[type] = currentState === 'N' ? 'Y' : 'N';
        this.setData({ detailData });
      },
      () => { },
    );
  },
  onUnload() {
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 上一个页面
    prevPage.getList();
  },
})
