Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  ready() {
  },
  methods: {
    handlerTouchmove() {},
    handlerRefresh() {
      this.triggerEvent('refresh');
    },
    handlerLoadMore() {
      this.triggerEvent('loadMore');
    },
  }
})