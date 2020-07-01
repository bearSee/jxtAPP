
var app = getApp();

Page({
  data: {
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
  // 页面隐藏时
  onUnload() {
    if (this.selectComponent('#comon-page')) {
      this.selectComponent('#comon-page').hiddenDel();
    }
  },
})
