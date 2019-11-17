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
      value: 'check',
    },
    value: {
      type: String,
      value: '',
    },
    options: {
      type: Array,
      value: [],
      observer() {
        this.resetOptions();
      },
    },
    optionProp: {
      type: Object,
      value: {
        label: 'value',
        value: 'key',
      },
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
    checkOptions: [],
  },
  
  ready: function () {
    this.setCheckedChange();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    resetOptions() {
      const checkOptions = this.properties.options;
      this.setData({ checkOptions });
    },
    handlerChange({ detail }) {
      const type = this.properties.type;

      const value = type === 'radio' ? detail.value.slice(-1).join() : detail.value.join();
      this.triggerEvent('input', { value });
      this.setCheckedChange();
    },
    setCheckedChange() {
      const { value, optionProp } = this.properties;
      const checkOptions = this.properties.options.map(option => ({
        ...option,
        checked: value.split(',').includes(option[optionProp.value]),
      }));
      this.setData({
        checkOptions,
      });
    },
  },
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除