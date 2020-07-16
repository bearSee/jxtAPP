var app = getApp();

Page({
  data: {
    mobileNumber: '',
    password: '',
  },
  onLoad: function () {
    this.setData({
      mobileNumber: wx.getStorageSync('mobileNumber') || '',
      password: wx.getStorageSync('password') || '',
    });
  },
  handlerPhoneChange(e) {
    const { value: mobileNumber } = e.detail;
    this.setData({ mobileNumber });
  },
  handlerPwdChange(e) {
    const { value: password } = e.detail;
    this.setData({ password });
  },
  login() {
    setTimeout(() => {
      const { mobileNumber, password } = this.data;
      wx.$http.post('init/login', { mobileNumber, password }, true).then(
        res => {
          app.finishLogin(res);
          wx.setStorageSync('mobileNumber', mobileNumber);
          wx.setStorageSync('password', password);
        },
        err => {
          // app.showModal({ content: err.message || '登录失败', hiddenCancel: true, confirmText: '好的' });
        }
      );
    }, 200);
  },
  gotoRegister() {
    wx.navigateTo({ url: '/pages/register/register' });
  },
  gotoReset() {
    wx.navigateTo({ url: '/pages/register/resetPwd' });
  },
})
