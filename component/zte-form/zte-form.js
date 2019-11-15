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
        this.formChange();
      },
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    removeSubmit: {
      type: Boolean,
      value: false,
    },
    submitText: {
      type: String,
      value: '提交',
    },
    tipsName: {
      type: String,
      value: '',
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    defFormItems: [],
    form: {},
  },
  
  ready: function () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 更新表单数据
    formChange() {
      const form = Object.assign({}, this.properties.formData);
      console.log('--formChange--', this.properties.formItems[0].label, this.properties.formData);
      this.setData({ form });
    },
    // 表单数据变更事件
    handlerDataChange(e) {
      const { value, item, selected } = e.detail;
      let form = this.data.form;
      if (item.code instanceof Array) {
        item.code.forEach((d, i) => {
          form[d] = value[i];
        })
      }
      if (typeof item.code == 'string') {
        form[item.code] = value;
      }

      const additObj = e.detail.additObj || {};
      form = { ...form, ...additObj };
      // 处理弹出框label变更，父组件只传递label初始值不应关注label变化，故注释
      // if (item.labelCode) {
      //   const label = item.optionProp && item.optionProp.label || 'value';
      //   form[item.labelCode] = selected[label];
      // }
      console.log('--修改form--', form);
      this.setData({ form });
      this.triggerEvent('change', { form, item });
    },
    // 点击view
    clickTag(e) {
      const { item } = e.detail;
      this.triggerEvent('clickTag', { item });
    },
    // 表单提交事件
    handlerSubmit() {
      const form = this.data.form;
      const formItems = this.properties.formItems;
      let bool = true;
      let tips = [];
      formItems.forEach(item => {
        if (item.requested && (!(item.code in form) || form[item.code] === '')) {
          bool = false;
          tips.push(item.label);
        }
        if ((!form[item.code] || form[item.code] === 'null') && form[item.code] !== 0) {
          form[item.code] = '';
        }
      });
      if (bool) {
        this.triggerEvent('submit', { form });
        return true;
      }
      app.showModal({
        content: `请填写${this.properties.tipsName}${tips.join('、')}`,
        hiddenCancel: true,
      })
      return false;
    },
  },
})