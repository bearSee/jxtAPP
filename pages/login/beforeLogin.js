//logs.js
var app = getApp();

Page({
  data: {
    helloText: '您好，\n欢迎使用及信通！',
    helloTextEn: 'Hello,welcome to use Jxtsoft !',
    loginBtnList: [
      {
        btnName: '账号密码登录',
        icon: 'right_arrow.png',
        type: 'pwd',
        className: 'pwd-login',
      },
      {
        btnName: '微信一键登录',
        icon: 'right_arrow.png',
        type: 'wx',
        className: 'wx-login',
      },
    ],
    data: '',
  },
  gotoLogin({ currentTarget }) {
    const { dataset } = currentTarget;
    const isPwdLogin = dataset.type === 'pwd';
    const { mobile, openid } = app.globalData;

    if (!isPwdLogin && mobile && openid) {
      app.mobileLogin({ openId: openid, mobile });
      return;
    }
    const url = isPwdLogin ? '/pages/login/pwdLogin' : '/pages/login/wxLogin';
    wx.navigateTo({ url });
  },
  gotoIndex() {
    wx.reLaunch({ url: '/pages/myReceive/myReceive' });
  },
  onLoad: function () {
    app.userLogin();
    this.setData({
      data: JSON.stringify(app.globalData.tabs),
    });
  },
  onShareAppMessage() {},
})
