const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    list: {
      type: Array,
      value: [],
    },
    showMatcherButton: {
      type: Boolean,
      value: false,
    },
    oprateList: {
      type: Array,
      value: [],
    },
  },
  data: {
    x: 0,
    itemindex: 0,
  },
  ready: function () {
  },
  methods: {
    clickList({ currentTarget }) {
      const { item } = currentTarget.dataset;
      this.triggerEvent('clickList', item);
    },
    oprate({ currentTarget }) {
      const { item, index, type } = currentTarget.dataset;
      this.triggerEvent('oprate', { item, type, index });
    },
    viewMatcherUser({ currentTarget }) {
      const { item } = currentTarget.dataset;
      const { matcherUser, id } = item;
      if (!matcherUser) {
        return;
      }
      this.triggerEvent('viewMatcherUser', { id });
    },
  },
});