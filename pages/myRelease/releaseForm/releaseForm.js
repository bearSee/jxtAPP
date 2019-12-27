//logs.js
const util = require('../../../utils/ajax.js');
var app = getApp();

Page({
  data: {
    /**
     * 
      {
        code: 'receiveObject',
        label: '接收对象',
        type: 'check',
        fastCode: 'Z001000',
      },
      {
        code: 'messageType',
        label: '消息类型',
        type: 'radio',
        fastCode: 'Z003000',
      },
     */
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
    msgList: [
      {
        reviceIndustryList: [
          {
            industryId: "106",
            industryLabel: "Z002002",
            industryLabelName: "方案研发设计",
            industryName: "电池",
          },
          {
            industryId: "106",
            industryLabel: "Z002002",
            industryLabelName: "方案研发设计",
            industryName: "电池",
          },
        ],
        userId: "3", area: 130202,
        areaName: "路南区",
        city: 1302,
        cityName: "唐山市",
        content: "<p>123123123</p>",
        createdDt: "2019-10-23 20:22:05",
        id: "fa889a32bd7e466aa41030dc7d0bf5b3",
        isBlacklist: "N",
        isCollection: "N",
        isComplaint: "N",
        messageType: "Z003001",
        province: 13,
        provinceName: "河北省",
        publisher: "qiye1",
        receiveObject: "Z001001,Z001002",
        receiveRegion: 130202006,
        title: "123",
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
  clearInput() {
    this.setData({ title: '' });
    this.getList();
  },
  search({ detail }) {
    const { value: title } = detail;
    this.setData({ title });
    this.getList();
  },
  tabsChange({ detail }) {
    const { code: type } = detail;
    this.setData({ type });
    this.getList();
  },
  getList() {
    const obj = {
      industryNews: 'industryNews/list',
      recruitmentNews: 'recruitmentNews/list',
    };
    const { type, title } = this.data;
    wx.$http.post(obj[type], {
      pageNum: 1,
      pageSize: 10,
      title,
    }).then(
      ({ list }) => {
        const msgList = list || [];
        // this.setData({ msgList });
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
          () => {
            this.selectComponent('#list').hiddenDel();
          },
        );
      },
      () => {
        this.selectComponent('#list').hiddenDel();
      },
    );
  },
  openDialog() {
    this.setData({ visible: true });
  },
  closeDialog() {
    this.setData({ visible: false });
  },
  chooseReleaseType({ currentTarget }) {
    const { type } = this.data;
    const { code } = currentTarget.dataset;
    wx.navigateTo({ url: `/pages/myRelease/releaseForm/releaseForm?type=${type}&code=${code}` });
    this.setData({ visible: false });
  },
  clickList({ detail }) {
    const { type } = this.data;
    const { code } = detail;
    wx.navigateTo({ url: `/pages/myRelease/messageDetail/messageDetail?type=${type}&code=${code}` });
  },
})
