Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    value: String,
    placeholder: {
      type: String,
      value: '搜索',
    },
  },
  data: {
  },
  methods: {
    handlerInput(e) {
      const value = e.detail.value;
      this.triggerEvent('input', { value });
    },
    handlerCancel() {
      const value = '';
      this.triggerEvent('cancel', { value });
    },
  },
})