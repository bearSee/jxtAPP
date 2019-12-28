
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
  onShow() {
    if (this.selectComponent('#comon-page')) {
      this.selectComponent('#comon-page').getList();
    }
  },
})
