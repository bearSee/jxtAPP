const getSelectOptions = Behavior({
  data: {
    optionProp: {
      label: 'value',
      value: 'key',
    },
  },
  methods: {
    getOptions() {
      const item = this.properties.item;
      if (item.fastCode) {
        this.getOptionsByFatCode(item.fastCode);
      } else if (item.ajax) {
        this.getOptionsByAjax(item.ajax || item.requestUrl, item.params || {});
      }
    },
    getOptionsByFatCode(fastCode) {
      const parmas = {
        type: fastCode,
      };
      wx.$http.post('common/combo/list', parmas).then(
        (res) => {
          const options = res.list;
          this.setData({
            'currentItem.options': options,
          });
        },
        () => {},
      );
    },
    getOptionsByAjax(ajax, params = {}) {
      wx.$http.post(ajax, params).then(
        (res) => {
          const options = res.list;
          this.setData({
            'currentItem.options': options,
          });
        },
        () => {},
      );
    },
  },
});

export default getSelectOptions;