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
      value: 'switch',
    },
    value: {
      type: Boolean,
      value: false,
      observer(val) {
        const { on } = this.properties;
        this.setData({ checked: val === on });
      },
    },
    on: {
      type: [Boolean, String],
      value: true,
    },
    off: {
      type: [Boolean, String],
      value: false,
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
    checked: false,
  },

  ready: function () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handlerChange({ detail }) {
      const { on, off } = this.properties;
      const value = detail.value ? on : off;
      this.triggerEvent('input', { value });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除