const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    formItems: {
      type: Array,
      value: [],
    },
    formData: {
      type: Object,
      value: {},
      observer() {
        this.formDataChange();
      },
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    isSubmit: {
      type: Boolean,
      value: true,
    },
    submitText: {
      type: String,
      value: '提交',
    },
  },
  data: {
    form: {},
  },
  
  ready: function () {
  },
  methods: {
    // 更新表单数据
    formDataChange() {
      const form = Object.assign({}, this.properties.formData);
      this.setData({ form });
    },
    // 表单数据变更事件
    handlerChange({ detail }) {
      const { value, item, selected } = detail;
      const { form } = this.data;
      if (typeof value === 'object' && Object.prototype.toString.call(value).toLowerCase() === '[object object]') {
        Object.assign(form, value);
      } else {
        form[item.code] = value;
      }
      this.setData({ form });
      this.triggerEvent('change', { form, item, selected });
    },
    // 点击view
    clickTag({ detail, currentTarget }) {
      const { item } = detail;
      const { index } = currentTarget.dataset;
      this.triggerEvent('clickTag', { item, index });
    },
    // 表单提交事件
    handlerSubmit() {
      const { form } = this.data;
      const { formItems } = this.properties;
      const tipLists = formItems.filter(({ code, required }) => [undefined, ''].includes(form[code]) && required).map(d => d.label);
      if (tipLists.length) {
        app.showModal({
          content: `${tipLists.join('、')}为空`,
          hiddenCancel: true,
        })
        return false;
      }
      this.triggerEvent('submit', { form });
      return true;
    },
  },
})