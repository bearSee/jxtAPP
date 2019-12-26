// pages/user/user.js
const app = getApp()

Page({
  data: {
    detailData: {},
  },
  getNoticeDetail(index) {
    wx.$http.post('publish/list', {
      pageNum: 1,
      pageSize: 999,
    }).then(
      ({ list }) => {
        const detailData = (list || [])[index] || {};
        this.setData({ detailData });
      },
      () => { },
    );
  },
  onLoad: function ({ index }) {
    if (index > -1) {
      this.getNoticeDetail(index);
    }
  },
})