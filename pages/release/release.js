//logs.js
const util = require('../../utils/ajax.js');
var app = getApp();

Page({
  data: {
    type: 'industryNews',
    msgList: [
      {
        createdDt: "2019-11-24 13:36:57",
        enabled: "Y",
        fullName: "广东省深圳市罗湖区桂园街道",
        id: "a4db4a6c89474698abea3bd24cd30a07",
        matcherUser: 0,
        messageType: "二手设备及转让",
        receiveObject: "企业,个人",
        receiveRegion: 440303001,
        title: "77",
        userId: "3",
      },
      {
        createdDt: "2019-09-02 23:08:07",
        enabled: "Y",
        fullName: "天津市非市辖区静海县唐官屯镇",
        id: "1f60c151232643448688d1a1374c00f0",
        matcherUser: 0,
        receiveObject: "企业",
        receiveRegion: 120223101,
        recruitmentPosition: "厂长",
        recruitmentProfessional: "翻译",
        recruitmentWork: "临时工",
        title: "嘎嘎嘎",
        userId: "3",
      },
    ],
  },
  clickList({ detail }) {
    console.log('clickList', detail);
  },
  getList(type) {
    const urlObj = {
      industryNews: 'industryNews/list',
      recruitmentNews: 'recruitmentNews/list',
    };
    wx.$http.post(urlObj[this.data.type], { pageNum: 1, pageSize: 10 }).then(
      ({ list }) => {
        this.msgList = list;
      },
      () => { },
    );
  },
  oprate({ detail }) {
    const { item, type, index } = detail;
    const {
      isBlacklist,
      isCollection,
      isComplaint
    } = item;

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
    console.log(detail);
  },
  onLoad: function () {
    this.getList();
  }
})
