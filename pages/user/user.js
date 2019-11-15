// pages/user/user.js
const app = getApp()

Page({
  data: {
    list: [
      {
        iconName: 'ri-smartphone-line',
        labelName: '个人资料',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '我的发布',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '我的收藏',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '黑名单管理',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '意见反馈',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '设置',
      },
    ],
    userInfo: {},
    userTypeName: '',
  },
  clickView({ detail }) {
    console.log(detail);
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