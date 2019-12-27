const getSelectOptions = Behavior({
  data: {
  },
  methods: {
    getOptions() {
      const {
        ajax, params, optionProps, fastCode, service, filter,
      } = this.properties.item;
      const props = optionProps || {
        label: 'dictName',
        value: 'dictCode',
      };
      if (ajax) {
        wx.$http.post(ajax, params).then(
          ({ list }) => {
            if (filter) list = list.filter(d => filter.includes(d[props.value]));
            this.setData({
              'currentItem.optionProps': props,
              'currentItem.options': list,
            });
          },
          () => {},
        );
      } else if (fastCode) {
        wx.$http.get(`${service || 'common'}/select/list/${fastCode}`).then(
          ({ list }) => {
            if (filter) list = list.filter(d => filter.includes(d[props.value]));
            this.setData({
              'currentItem.optionProps': props,
              'currentItem.options': list,
            });
          },
        ).catch();
      }
    },
  },
});

export default getSelectOptions;