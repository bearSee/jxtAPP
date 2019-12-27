var timer = null;
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
    handlerInput({ detail }) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const value = detail.value;
        this.triggerEvent('input', { value });
      }, 1000);
    },
    handlerCancel() {
      const value = '';
      this.triggerEvent('cancel', { value });
    },
  },
})