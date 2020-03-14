// pages/viewUserInfo/viewUserInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    iconName: '',
    isPersonal: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ userId }) {
    this.getUserInfo(userId);
  },
  getUserInfo(userId) {
    wx.$http.post('user/info', { userId }).then(
      ({ info }) => {
        const userInfo = info || {};
        const isPersonal = userInfo.userType === 'Z001002';
        const iconName = isPersonal ? '个' : '企';
        this.setData({ userInfo, isPersonal, iconName });
      },
      () => { },
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})