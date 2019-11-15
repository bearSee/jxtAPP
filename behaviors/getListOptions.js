
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
        (res) => {
          let options = pageNum === 1 ? [] : currentItem.options;
          options = options.concat(res.list);
          const total = res.total;
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
    handlerSearch(e) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const keyword = e.detail.value;
        this.setData({
          keyword,
        });
        this.getInterfaceData(1);
      }, 500);
    },
  },
});

export default getListOptions;