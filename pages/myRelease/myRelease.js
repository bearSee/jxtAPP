
var app = getApp();

Page({
  data: {
    loadTimes: 0,
    oprateList: [
      {
        type: 'edit',
        name: '编辑',
        selected: 'ri-edit-line',
        select: 'ri-edit-line',
      },
      {
        type: 'delete',
        name: '删除',
        selected: 'ri-delete-bin-5-line',
        select: 'ri-delete-bin-5-line',
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
