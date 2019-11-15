const app = getApp();
Component({
  properties: {
    navbarData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    },
    delta: {
      type: Number,
      value: 1,
    },
    selfBack: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    height: app.globalData.height,
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    }
  },
  methods: {
    // 返回上一页面
    _navback() {
      const delta = this.properties.delta;
      const selfBack = this.properties.selfBack;
      if (selfBack) {
        this.triggerEvent('customBack');
        return;
      }
      wx.navigateBack({ delta });
    },
  }

})