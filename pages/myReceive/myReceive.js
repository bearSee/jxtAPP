
var app = getApp();

Page({
  data: {
  },
  // 触发上拉加载
  onReachBottom: function () {
    if (this.selectComponent('#comon-page')) {
      this.selectComponent('#comon-page').getNextPage();
    }
  },
  // 页面隐藏时
  onUnload() {
    if (this.selectComponent('#comon-page')) {
      this.selectComponent('#comon-page').hiddenDel();
    }
  },
})
