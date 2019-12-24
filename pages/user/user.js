// pages/user/user.js
const app = getApp()

Page({
  data: {
    list: [
      {
        iconName: 'ri-smartphone-line',
        labelName: '个人资料',
        url: '/pages/user/personInfo/index',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '我的发布',
        url: '',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '我的收藏',
        url: '',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '黑名单管理',
        url: '/pages/blackList/blackList',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '意见反馈',
        url: '',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '设置',
        url: '/pages/user/userSet/index',
      },
    ],
    userInfo: {},
    userTypeName: '',
  },
  clickView({ detail }) {
    const { url } = detail;
    wx.navigateTo({ url });
  },
  onLoad: function () {
    const userInfo = app.globalData.userInfo;
    const userTypeObj = {
      'ADMIN': '管理员',
      'Z001002': '个人用户',
      'Z001001': '企业用户',
    };
    this.setData({
      userInfo,
      userTypeName: userTypeObj[userInfo.userType] || '--' });
  },
})