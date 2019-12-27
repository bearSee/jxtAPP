import getSelectOptions from '../behaviors/getSelectOptions.js'; // 请求下拉框事件
import getListOptions from '../behaviors/getListOptions.js'; // 请求弹出框事件
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
    disabled: Boolean,
    value: null,
    showLabel: null,
    isLast: Boolean,
  },
  data: {
    currentItem: {},
  },
  ready: function () {
  },
  methods: {
    // 初始化组件信息
    initItem () {
      const { item: currentItem } = this.properties;
      const transType = {
        bankCard: 'number',
        phone: 'number',
        num: 'number',
        amount: 'digit',
        mobile: 'number',
        money: 'digit',
        city: 'tagView',
      };
      currentItem.type = transType[currentItem.type] || currentItem.type;
      this.setData({ currentItem });
      // 初始化options数据
      const optionsArray = ['select', 'radio', 'check', 'table'];
      if (optionsArray.includes(currentItem.type)) this.getOptions();
    },
    // 值变更事件
    handlerInput({ detail }) {
      const { value, selected } = detail;
      const item = this.data.currentItem;
      this.triggerEvent('input', { value, selected, item });
    },
    // 文本框失去焦点事件
    handlertBlur({ detail }) {
      const value = detail.value;
      const item = this.data.currentItem;
      this.triggerEvent('blur', { value, item });
    },
    // 点击view
    clickTag({ currentTarget }) {
      const { item } = currentTarget.dataset;
      this.triggerEvent('clickTag', { item });
    },
  },
});