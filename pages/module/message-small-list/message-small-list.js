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
  },
  data: {
    x: 0,
    itemindex: 0,
    oprateList: [
      {
        type: 'isCollect',
        selected: 'ri-heart-fill',
        select: 'ri-heart-line',
      },
      {
        type: 'isBlacklist',
        selected: 'ri-user-unfollow-fill',
        select: 'ri-user-add-line',
      },
      {
        type: 'isComplaint',
        selected: 'ri-shield-star-fill',
        select: 'ri-shield-star-line',
      },
    ],
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
    // 外部调用，隐藏删除按钮
    hiddenDel() {
      this.setData({ itemIndex: -1, x: 0 });
    },
  },
});