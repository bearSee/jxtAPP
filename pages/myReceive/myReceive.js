
var app = getApp();

Page({
  data: {
    loadTimes: 0,
    oprateList: [
      {
        type: 'isCollect',
        selected: 'ri-heart-fill',
        select: 'ri-heart-line',
      },
      {
        type: 'isBlacklist',
        selected: 'ri-user-unfollow-fill',
        select: 'ri-user-add-line',
      },
      {
        type: 'isComplaint',
        selected: 'ri-shield-star-fill',
        select: 'ri-shield-star-line',
      },
    ],
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
  // 页面隐藏时
  onUnload() {
    if (this.selectComponent('#comon-page')) {
      this.selectComponent('#comon-page').hiddenDel();
    }
  },
})
