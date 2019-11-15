import getSelectOptions from '../../behaviors/getSelectOptions.js'; // 请求下拉框事件
import getListOptions from '../../behaviors/getListOptions.js'; // 请求弹出框事件
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  behaviors: [
    getSelectOptions,
    getListOptions,
  ],
  properties: {
    item: {
      type: Object,
      value: {},
      observer() {
        this.initItem();
      },
    },
    label: String,
    value: null,
    showValue: null,
    requested: {
      type: Boolean,
      value: false,
    },
    importantMark: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    isLast: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    currentItem: {},
  },
  ready: function () {
  },
  methods: {
    // 初始化组件信息
    initItem () {
      const currentItem = this.properties.item;
      this.setData({ currentItem });

      const optionsArray = ['select', 'radio', 'check'];
      if (optionsArray.includes(currentItem.type)) {
        this.getOptions();
      }
    },
    // 值变更事件
    handlerInput(e) {
      const value = e.detail.value;
      const selected = e.detail.selected;
      const additObj = e.detail.additObj || {};
      const item = this.data.currentItem;
      this.triggerEvent('input', { value, item, selected, additObj });
    },
    // 文本框失去焦点事件
    handlertTextBlur(e) {
      const value = e.detail.value;
      const item = this.data.currentItem;
      this.triggerEvent('textBlur', { value, item });
    },
    // 点击view
    clickTag(e) {
      const { item } = e.currentTarget.dataset;
      this.triggerEvent('clickTag', { item });
    },
  },
});