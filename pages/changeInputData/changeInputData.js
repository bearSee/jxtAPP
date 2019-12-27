//logs.js
var app = getApp();

Page({
  data: {
    content: '',
    config: {},
    value: '',
  },
  submit() {
    const { value, config } = this.data;
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 上一个页面

    const formData = prevPage.data.formData;
    formData[config.code] = value;
    prevPage.setData({ formData });
    wx.navigateBack();
    setTimeout(() => {
      prevPage.submit();
    }, 1000);
  },
  handlerInput({ detail }) {
    const { value } = detail;
    this.setData({ value });
  },
  onLoad({ config, value }) {
    config = JSON.parse(config || {});
    value = value || '';
    this.setData({ config, value });
  },
})
