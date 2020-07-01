const app = getApp();
var timer = null;

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    list: {
      type: Array,
      value: [],
      observe() {
        this.hiddenDel();
      },
    },
    movable: {
      type: Boolean,
      value: true,
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
    handlerDelete({ currentTarget }) {
      const { item, index } = currentTarget.dataset;
      this.triggerEvent('handlerDelete', { item, index });
      const itemIndex = '';
      this.setData({ itemIndex });
    },
    changeDrag({ detail, currentTarget }) {
      clearTimeout(timer);
      const { x, source } = detail;
      if (x < 0) {
        timer = setTimeout(() => {
          const { itemindex } = currentTarget.dataset;
          this.setData({ itemindex, x });
        }, 200);
      }
    },
    viewMatcherUser({ currentTarget }) {
      const { item } = currentTarget.dataset;
      const { matcherUser, id } = item;
      if (!matcherUser) {
        return;
      }
      this.triggerEvent('viewMatcherUser', { id });
    },
    // 外部调用，隐藏删除按钮
    hiddenDel() {
      this.setData({ itemIndex: -1, x: 0 });
    },
  },
});