const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    path: '',
  },
  /**
   * 组件的方法列表
   */
  ready() {
    const path = app.globalData.fileHead + this.properties.value;
    this.setData({ path });
  },
  methods: {
    uploadPic(e) {
      if (this.properties.disabled) {
        if (this.data.path) {
          wx.previewImage({
            urls: [this.data.path],
          })
        }
        return;
      }
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          const value = res.tempFilePaths[0];
          that.triggerEvent('input', { value });
        },
      })
    },
  }
})