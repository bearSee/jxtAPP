const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
  },
  data: {
    logined: app.globalData.logined,
  },
  ready: function () {
    this.setData({ logined: app.globalData.logined });
  },
  methods: {
    gotoLogin() {
      app.showModal({
        content: '当前暂未登录，请登录后使用完整功能。',
        confirmText: '前往登录',
      }).then(() => {
        wx.redirectTo({ url: '/pages/login/beforeLogin' });
      });
    },
  },
});