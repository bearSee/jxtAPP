//logs.js
const util = require('../../utils/ajax.js');
var app = getApp();

Page({
  data: {
    mobileNumber: '',
    password: '',
    verifyCode: '',
    seconds: 60,
    timer: null,
  },
  handlerBlur({ detail, currentTarget }) {
    const { value } = detail;
    const { key } = currentTarget.dataset;
    this.setData({
      [key]: value,
    });
  },
  getVerifyCode() {
    setTimeout(() => {
      const { seconds, mobileNumber } = this.data;
      if (seconds !== 60) return;
      if (!mobileNumber) {
        app.showModal({ content: '请先输入手机号', hiddenCancel: true, confirmText: '好的' });
        return;
      }
      // 验证码倒计时
      const timer = setInterval(() => {
        if (this.data.seconds) {
          this.setData({
            seconds: this.data.seconds - 1,
          })
        } else {
          clearInterval(this.data.timer);
          this.setData({ seconds: 60 });
        }
      }, 1000);
      this.setData({ timer, seconds: 59 });

      wx.$http.post('init/verifcatCode/forget', { mobileNumber }).then(
        () => {},
        () => {
          clearInterval(this.data.timer);
          this.setData({ seconds: 60 });
        }
      );
    }, 200);
  },
  submit() {
    setTimeout(() => {
      const { mobileNumber, password, verifyCode } = this.data;
      wx.$http.post('init/forget', { mobileNumber, password, verifyCode }).then(
        () => {
          app.showModal({ content: '密码重置成功', hiddenCancel: true, confirmText: '好的' }).then(
            () => {
              this.login();
            },
          );
        },
        () => { }
      );
    }, 200);
  },
  login() {
    const { mobileNumber, password } = this.data;
    wx.$http.post('init/login', { mobileNumber, password }).then(
      res => {
        app.finishLogin(res);
      },
      () => {
        wx.navigateTo({ url: '/pages/login/pwdLogin' });
      }
    );
  },
  onLoad: function () {
    const mobileNumber = app.globalData.mobile || '';
    this.setData({ mobileNumber });
  }
})
