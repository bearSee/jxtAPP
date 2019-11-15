const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'text',
    },
    value: null,
    placeholder: String,
    maxLength: {
      type: Number,
      value: -1,
    },
    height: {
      type: Number,
      value: 160,
    },
    disabled: {
      type: Boolean,
      value: false,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    textLength: 0,
  },
  
  ready: function () {
    this.getTextLength();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 文本框input事件
    handlerInput(e) {
      const value = e.detail.value;
      this.triggerEvent('input', { value });
      this.getTextLength();
    },
    // 文本域计算文本长度方法
    getTextLength() {
      if (this.properties.type === 'textarea') {
        const textLength = this.properties.value ? this.properties.value.length : 0;
        this.setData({
          textLength,
        });
      }
    },
    // 文本框blur事件
    handlerBlur(e) {
      const value = e.detail.value;
      this.triggerEvent('blur', { value });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除