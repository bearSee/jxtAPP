
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    wordTips: {
      type: String,
      value: '请输入搜索内容'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    timer: null,
  },
  ready: function () {
  },
  /**
   * 组件的方法列表
   */

  methods: {
    // 点开搜索栏
    showInput: function () {
      this.setData({
        inputShowed: true
      });
    },
    // 隐藏搜索栏
    hideInput: function () {
      this.setData({ inputShowed: false });
      if (this.data.inputVal) {
        this.setData({ inputVal: '' });
        this.triggerEvent('clearInput');
      }
    },
    // 清除搜索框内容
    clearInput: function () {
      this.setData({
        inputVal: "",
      });
      this.triggerEvent('clearInput');
    },
    // 输入change事件
    inputTyping: function (e) {
      clearTimeout(this.data.timer);
      this.data.timer = setTimeout(() => {
        const value = e.detail.value;
        this.setData({
          inputVal: value,
        })
        this.triggerEvent('search', { value });
      }, 1000)
    },
    blur() {
      this.setData({ inputShowed: false });
    },
  },
})
