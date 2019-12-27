
var timer;
const getListOptions = Behavior({
  data: {
    pageNum: 1,
    pageSize: 20,
    total: 0,
    keyword: '',
  },
  methods: {
    getInterfaceData(pageNum) {
      const { currentItem, keyword } = this.data;
      const params = {
        pageNum,
        pageSize: this.data.pageSize,
        ...currentItem.params,
        keyword,
      };
      wx.$http.post(currentItem.requestUrl, params).then(
        ({ page }) => {
          let options = pageNum === 1 ? [] : currentItem.options;
          options = options.concat(page.list || []);
          const total = page.totalCount;
          this.setData({
            'currentItem.options': options,
            pageNum,
            total,
          });
        },
        () => { },
      );
    },
    handlerRefresh() {
      this.getInterfaceData(1);
    },
    handlerLoadMore() {
      const { pageNum, pageSize, total } = this.data;
      if (pageNum * pageSize < total) {
        this.getInterfaceData(pageNum + 1);
      }
    },
    handlerSearch({ detail }) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.setData({ keyword: detail.value });
        this.getInterfaceData(1);
      }, 500);
    },
  },
});

export default getListOptions;