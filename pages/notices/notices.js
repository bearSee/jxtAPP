// pages/user/user.js
const app = getApp()

Page({
  data: {
    noticeList: [],
  },
  viewNotice({ currentTarget }) {
    const { index } = currentTarget.dataset;
    const url = `/pages/notices/noticesDetail/noticesDetail?index=${index}`;
    wx.navigateTo({ url });
  },
  getNoticeList() {
    wx.$http.post('publish/list', {
      pageNum: 1,
      pageSize: 999,
    }).then(
      ({ list }) => {
        const noticeList = (list || []).map(d => ({
          ...d,
          createdDt: d.createdDt.slice(0, 10),
        }));
        this.setData({ noticeList });
      },
      () => { },
    );
  },
  onLoad: function () {
    this.getNoticeList();
  },
})