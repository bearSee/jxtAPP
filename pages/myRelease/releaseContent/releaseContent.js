//logs.js
var app = getApp();

Page({
  data: {
    content: '',
  },
  onLoad() {
    this.setData({
      content: app.globalData.content,
    });
  },
  submit({ detail }) {
    const { html } = detail;
    if (!html) {
      app.showModal({
        content: '请输入发布内容',
        hiddenCancel: true,
      });
      return;
    }
    
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 上一个页面
    const { formData } = prevPage.data;
    formData.content = html;
    prevPage.setData({ formData });
    prevPage.finishSubmit();
  },
  handlerInput({ detail }) {
    const { value: content } = detail;
    this.setData({ content });
  },
})
