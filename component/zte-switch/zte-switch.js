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
      type: null,
      value: false,
      observer(newVal) {
        const oldVal = this.properties.on;
        const isContain = newVal && newVal.indexOf(oldVal) != -1 || oldVal.indexOf(newVal) != -1;
        const checked = newVal === oldVal || isContain;
        // 遇到一个情况：在真机调试和编译器中正常，但是开发版与线上版表现为newVal、this.properties.on 都为Y，但是长度分别为2、1，多了个空格，很奇怪
        // console.log(newVal.length, this.properties.on.length, checked);
        this.setData({ checked });
      },
    },
    on: {
      type: null,
      value: true,
    },
    off: {
      type: null,
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
    // 文本框input事件
    handlerChange(e) {
      const { on, off } = this.properties;
      const value = e.detail.value ? on : off;
      this.triggerEvent('input', { value });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除