const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'check',
    },
    showValue: null,
    searchTips: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    label: {
      type: String,
      value: '',
      observer() {
        this.getCurrentLabel();
      },
    },
    options: {
      type: Array,
      value: [],
      observer() {
        var { value, options, optionProp, additionalProps, showLabel } = this.properties;
        optionProp = optionProp ? optionProp : { label: 'value', value: 'key' };
        let index = options.findIndex(opt => opt[optionProp.value] === value || value.indexOf(opt[optionProp.value]) != -1);
        this.setData({ index });
      },
    },
    // additionalProps: { code: '', valueCode: '' }
    // 附加字段，将options内valueCode的值赋给code
    additionalProps: {
      type: Object,
      value: {},
    },
    optionProp: {
      type: Object,
      value: {
        label: 'value',
        value: 'key',
      },
    },
    // 搜索弹窗页，头部配置
    headConfig: {
      type: Object,
      value: {
        options: [],
        optionProp: {
          label: 'value',
          value: 'key',
        },
        title: '',
        url: '',
      },
      observer(newVal) {
        if (!newVal) return;
        this.setData({ headLael: newVal.optionProp.label });
      },
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
    index: 0,
    popupVisible: false,
    currentLabel: '',
    searchValue: '',
    headOptions: [],
    headLael: '',
  },
  
  ready: function () {
    if (this.properties.options.length) this.getSelectIndex();
    const { headConfig } = this.properties;
    if (headConfig && headConfig.url) this.getHeadList(headConfig.url);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 下拉选择事件
    getSelectIndex() {
      var { value, options, optionProp, additionalProps, showLabel } = this.properties;
      optionProp = optionProp ? optionProp : { label: 'value', value: 'key' };
      // let index = options.findIndex(opt => opt[optionProp.value] === value || value.indexOf(opt[optionProp.value]) != -1);
      let index = options.findIndex(opt => {
        return opt[optionProp.value] === value || value.indexOf(opt[optionProp.value]) != -1;
      });
      // 默认选中第一个
      // index = index === -1 ? 0 : index;
      this.setData({ index });
      const additObj = {};
      if (options.length) {
        // value = value || options[index][optionProp.value];
        if (additionalProps && additionalProps.code) {
          additObj[additionalProps.code] = options[index === -1 ? 0 : index][additionalProps.valueCode]
        }
      }
      this.triggerEvent('input', { value, additObj });
    },
    handlerPickerChange(e) {
      const index = e.detail.value;
      this.setData({ index });
      const { options, optionProp } = this.properties;
      const selected = options[index];
      const value = options[index][optionProp.value];
      const additionalProps = this.properties.additionalProps;
      const additObj = {};
      if (additionalProps && additionalProps.code) {
        additObj[additionalProps.code] = options[index][additionalProps.valueCode]
      }

      this.triggerEvent('input', { value, selected, additObj });
    },
    // 弹出选择事件
    getCurrentLabel() {
      const currentLabel = this.properties.label;
      this.setData({ currentLabel });
    },
    handlerOpenPopup() {
      if (this.properties.disabled) {
        return;
      }
      this.setData({
        popupVisible: true,
        searchValue: '',
      });
      this.triggerEvent('search', { value: '' });
    },
    handlerRefresh() {
      this.triggerEvent('refresh');
    },
    handlerLoadMore() {
      this.triggerEvent('loadMore');
    },
    handlerCancel() {
      this.setData({
        popupVisible: false,
      });
    },
    handlerSearch(e) {
      const value = e.detail.value;
      this.setData({
        searchValue: value,
      });
      this.triggerEvent('search', { value });
    },
    handlerSelect(e) {
      const optionProp = this.properties.optionProp;
      const { additionalProps, headConfig } = this.properties;
      const selected = e.currentTarget.dataset.option;
      const value = selected[optionProp.value] || selected[headConfig.optionProp.value];
      const currentLabel = selected[optionProp.label];
      
      const additObj = {};
      if (additionalProps && additionalProps.code) {
        additObj[additionalProps.code] = selected[additionalProps.valueCode]
      }
      this.triggerEvent('input', { value, selected, additObj });
      this.setData({
        popupVisible: false,
        currentLabel,
      });
    },
    getHeadList(url) {
      wx.$http.post(url, {}).then(
        res => {
          const list = res.list || [];
          const headOptions = list.splice(0, 4);
          this.setData({ headOptions });
        },
        err => { }
      )
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除