const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'select',
    },
    searchTips: {
      type: String,
      value: '',
    },
    // select类型，初始选中的下标
    selectedIndex: {
      type: [Number, String],
      value: '',
    },
    value: {
      type: String,
      value: '',
      observer() {
      },
    },
    label: {
      type: String,
      value: '',
    },
    code: String,
    trans: {
      type: Array,
      value: [],
    },
    showLabel: String,
    options: {
      type: Array,
      value: [],
      observer() {
        this.initSelect();
      },
    },
    optionProps: {
      type: Object,
      value: {
        label: 'value',
        value: 'key',
      },
      observer() {
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
    index: '',
    popupVisible: false,
    currentLabel: '',
    searchValue: '',
  },
  
  ready: function () {
    this.initSelect();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initSelect() {
      var { label, value, options, optionProps, selectedIndex } = this.properties;
      let index = options.findIndex(opt => opt[optionProps.value] === value);
      const defaultIndex = isNaN(parseInt(selectedIndex)) ? '' : selectedIndex;

      if (index === -1) {
        if (isNaN(parseInt(selectedIndex))) {
          index = '';
        } else {
          index = selectedIndex;
          const val = options[index];
          this.triggerEvent('input', { value: val });
        }
      }
      this.setData({ index });
    },
    handlerPickerChange({ detail }) {
      const index = detail.value;
      const { options, optionProps, trans, code } = this.properties;
      const selected = options[index];
      const value = {};
      value[code] = selected[optionProps.value];

      trans.forEach((d) => {
        value[d.to] = selected[d.from] || '';
      });
      this.setData({ index });
      this.triggerEvent('input', { value, selected });
    },
    handlerOpenPopup() {
      if (this.properties.disabled) return;
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
      this.setData({ popupVisible: false });
    },
    handlerSearch({ detail }) {
      const searchValue = detail.value;
      this.setData({ searchValue });
      this.triggerEvent('search', { value });
    },
    handlerSelect({ currentTarget }) {
      const { optionProps, trans, code, showLabel } = this.properties;
      const selected = currentTarget.dataset.option;
      const value = {};
      value[code] = selected[optionProps.value];
      trans.forEach((d) => {
        value[d.to] = selected[d.from] || '';
      });
      const currentLabel = value[showLabel || optionProps.label];
      
      this.triggerEvent('input', { value, selected });
      this.setData({
        popupVisible: false,
        currentLabel,
      });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除