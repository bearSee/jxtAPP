
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: '',
      observer() {
        this.initSelected();
      },
    },
    disabled: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    selected: [],
  },
  
  ready: function () {
    this.initSelected();
  },
  methods: {
    initSelected() {
      const { value } = this.properties;
      const selected = value.split(',');
      this.setData({ selected });
    },
    // 地区选择
    regionChange: function ({ detail }) {
      const value = detail.value;
      this.setData({ selected: value });
      this.triggerEvent('input', { value });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除