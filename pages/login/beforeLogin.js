//logs.js
const util = require('../../utils/ajax.js');
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
        btnName: '微信账号登录',
        icon: 'right_arrow.png',
        type: 'wx',
        className: 'wx-login',
      },
    ],
  },
  gotoLogin({ currentTarget }) {
    const { dataset } = currentTarget;
    const { type } = dataset;

    const url = type === 'pwd' ? '/pages/login/pwdLogin' : '/pages/login/wxLogin';
    wx.navigateTo({ url });
  },
  onLoad: function () {
    app.userLogin();
  }
})