
var app = getApp();

Page({
  data: {
    loadTimes: 0,
  },
  // 触发上拉加载
  onReachBottom: function () {
    if (this.selectComponent('#comon-page')) {
      this.selectComponent('#comon-page').getNextPage();
    }
  },
  onLoad() {
  },
  onShow() {
    const { loadTimes } = this.data;
    if (loadTimes < 1) {
      this.setData({
        loadTimes: loadTimes + 1,
      });
      return;
    };
    if (this.selectComponent('#comon-page')) {
      this.selectComponent('#comon-page').getList();
    }
  },
})
