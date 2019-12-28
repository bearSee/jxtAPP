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
    password: {
      type: Boolean,
      value: false,
    },
    value: null,
    placeholder: String,
    maxlength: {
      type: Number,
      value: -1,
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
    currentVal: '',
  },
  
  ready: function () {
    this.initValue();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initValue() {
      let { value } = this.properties;
      value = value || '';
      this.triggerEvent('input', { value });
      this.getTextLength();
    },
    // 文本框input事件
    handlerInput({ detail }) {
      const value = detail.value;
      this.setData({
        currentVal: value,
      });
      this.triggerEvent('input', { value });
      this.getTextLength();
    },
    // 文本域计算文本长度方法
    getTextLength() {
      const { value } = this.properties;
      const { currentVal } = this.data;
      const val = currentVal || value || '';
      const textLength = val && val.length || 0;
      this.setData({ textLength });
    },
    // 文本框blur事件
    handlerBlur({ detail }) {
      this.triggerEvent('blur', { value: detail.value });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除