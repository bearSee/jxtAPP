//logs.js
const util = require('../../utils/ajax.js');
var app = getApp();

Page({
  data: {
    isPesonal: true,
    hasReady: false,
    mobileNumber: '',
    password: '',
    verifyCode: '',
    seconds: 60,
    timer: null,
  },
  changeType({ currentTarget }) {
    const { type } = currentTarget.dataset;
    const isPesonal = type === 'isPesonal';
    this.setData({ isPesonal });
  },
  handlerBlur({ detail, currentTarget }) {
    const { value } = detail;
    const { key } = currentTarget.dataset;
    this.setData({
      [key]: value,
    });
  },
  getVerifyCode() {
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

    wx.$http.post('init/verifcatCode', { mobileNumber }).then(
      () => {},
      () => {
        clearInterval(this.data.timer);
        this.setData({ seconds: 60 });
      }
    );
  },
  checkboxChange({ detail }) {
    const hasReady = detail.value.length;
    this.setData({ hasReady });
  },
  readAgreement() {
    wx.navigateTo({ url: '/pages/register/agreement' });
  },
  // 个人用户Z001002
  // 企业用户Z001001
  submit() {
    const { isPesonal, hasReady, mobileNumber, password, verifyCode } = this.data;
    if (!hasReady) {
      app.showModal({ content: '请勾选同意网站协议按钮', hiddenCancel: true, confirmText: '好的' });
      return;
    }
    const userType = isPesonal ? 'Z001002' : 'Z001001';
    wx.$http.post('init/register', { userType, mobileNumber, password, verifyCode }).then(
      () => {
        app.showModal({ content: '注册成功', hiddenCancel: true, confirmText: '好的' }).then(
          () => {
            this.login();
          },
        );
      },
      () => { }
    );
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
  }
})
