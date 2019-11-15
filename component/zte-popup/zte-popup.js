const app = getApp();
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer(newVal) {
        this.handlerVisible(newVal);
      },
    },
  },
  data: {
    height: app.globalData.height,
    className: '',
  },
  methods: {
    handlerVisible(visible) {
      const className = visible ? 'active' : 'hidden';
      this.setData({  className });
    },
  },
})