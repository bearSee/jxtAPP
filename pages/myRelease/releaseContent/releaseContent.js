//logs.js
var app = getApp();

Page({
  data: {
    content: '',
  },
  onLoad({ content }) {
    this.setData({ content });
  },
  submit() {
    const { content } = this.data;
    if (!content) {
      app.showModal({
        content: '请输入发布内容',
        hiddenCancel: true,
      });
      return;
    }
    
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 上一个页面
    const { formData } = prevPage.data;
    formData.content = content;
    prevPage.setData({ formData });
    wx.navigateBack();
    prevPage.finishSubmit();
  },
  handlerInput({ detail }) {
    const { value: content } = detail;
    this.setData({ content });
  },
})
