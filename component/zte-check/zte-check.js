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
    code: String,
    trans: {
      type: Array,
      value: [],
    },
    options: {
      type: Array,
      value: [],
      observer() {
        if (this.properties.options.length) {
          this.setCheckedChange();
        }
      },
    },
    optionProps: {
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
    this.initValue();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initValue() {
      let { value, code } = this.properties;
      value = { [code]: value || '' };
      this.triggerEvent('input', { value });
    },
    handlerChange({ detail }) {
      const { options, optionProps, type, trans, code } = this.properties;
      const value = {};
      value[code] = type === 'radio' ? detail.value.slice(-1).join() : detail.value.join();
      const data = detail.value.map(d => options.find(v => v[optionProps.value] === d) || {});
      trans.forEach(d => {
        value[d.to] = type === 'radio' ? data.map(obj => obj[d.from]).slice(-1).join() : data.map(obj => obj[d.from]).join();
      });
      this.triggerEvent('input', { value });
      this.setCheckedChange(value[code]);
    },
    setCheckedChange(val) {
      const { value, optionProps, options } = this.properties;
      val = val || value;
      const checkOptions = options.map(option => ({
        ...option,
        checked: val.split(',').includes(option[optionProps.value]),
      }));
      this.setData({ checkOptions });
    },
  },
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除