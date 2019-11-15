//logs.js
const util = require('../../utils/ajax.js');
var app = getApp();

Page({
  data: {
    mobileNumber: '',
    password: '',
  },
  onLoad: function () {
  },
  handlerPhoneBlur(e) {
    const { value: mobileNumber } = e.detail;
    this.setData({ mobileNumber });
  },
  handlerPwdBlur(e) {
    const { value: password } = e.detail;
    this.setData({ password });
  },
  login() {
    const { mobileNumber, password } = this.data;
    wx.$http.post('init/login', { mobileNumber, password }, true).then(
      res => {
        app.finishLogin(res);
      },
      err => {
        app.showModal({ content: err.message || '登录失败', hiddenCancel: true, confirmText: '好的' });
      }
    );
  },
  gotoRegister() {
    wx.navigateTo({ url: '/pages/register/register' });
  },
})
