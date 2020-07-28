//logs.js
var app = getApp();

Page({
  data: {
    content: '',
    mobileNumber: '',
  },
  onLoad() {
    this.setData({
      mobileNumber: app.globalData.mobile || '',
    });
  },
  submit() {
    const { content, mobileNumber } = this.data;
    wx.$http.post('messageBoard/save', { content, mobileNumber }).then(
      () => {
        wx.showToast({ title: '提交成功', mask: true });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      },
      () => { },
    );
  },
  handlerInput({ detail, currentTarget }) {
    const { value } = detail;
    const { code } = currentTarget.dataset;
    this.setData({ [code]: value });
  },
})
