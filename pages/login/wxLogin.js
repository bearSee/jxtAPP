//logs.js
const util = require('../../utils/ajax.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChangeMobile: false,
    mobile: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { mobile } = app.globalData.userInfo;
    const { isChangeMobile } = options;
    if (mobile) mobile = `${mobile.slice(0, 3)} ${mobile.slice(3, 7)} ${mobile.slice(7)}`;
    this.setData({ isChangeMobile: isChangeMobile || false, mobile });
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
  getPhoneNumber(e) {
    if (e.detail.errMsg.indexOf('fail') > -1) return;
    const params = {
      openId: app.globalData.openid, encryptedData: e.detail.encryptedData, iv: e.detail.iv
    };
    wx.$http.post('wechatmini/decryptuserinfo', params).then(
      ({ data }) => {
        app.mobileLogin(data);
      },
      err => {},
    )
  },
})
