
/**
 * POST请求，
 * URL：接口
 */
function post(url, data, hiddenFailModal, hiddenLoading) {
  const app = getApp();
  const host = app.globalData.host;
  const Authorization = wx.getStorageSync('Authorization') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJleHAiOjE1NzM4MTIxMjEsImlzcyI6InpoaWRpYW4iLCJuYmYiOjE1NzM4MDg1MjEsImVtcGxveWVlTnVtYmVyIjoiIiwiY29tcGFueU5hbWUiOiIiLCJpYXQiOjE1NzM4MDg1MjEsInJlbWVtYmVyVGltZSI6MTU3NDQxMzMyMSwiZW1wbG95ZWVOYW1lIjoiIiwiY29tcGFueUNvZGUiOiIiLCJ1c2VyVHlwZSI6IlowMDEwMDEifQ.KOwHb1K6ijXuh7fZZm74onwg5nUjBnAeEzh';
  return new Promise((resolve, reject) => {
    if (!hiddenLoading) {
      wx.showLoading({
        title: '加载中',
        mask: true,
      })
    }
    wx.request({
      url: host + url,
      header: { 'content-type': 'application/x-www-form-urlencoded', Authorization },
      data,
      method: 'POST',
      success: res => {
        wx.hideLoading();
        interceptors(res, resolve, reject, hiddenFailModal);
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '啊噢，好像服务器遇上了点问题',
          icon: 'none',
          duration: 2000,
        })
        reject(err);
      },
    })
  })
}

//GET请求，不需传参，直接URL调用，
function get(url) {
  const app = getApp();
  const host = app.globalData.host;
  const Authorization = wx.getStorageSync('Authorization') || '';
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url,
      header: { 'content-type': 'application/x-www-form-urlencoded', Authorization },
      method: 'GET',
      success: (res) => {
        interceptors(res, resolve, reject);
      },
      fail: (err) => {
        wx.showToast({
          title: '啊噢，好像服务器遇上了点问题',
          icon: 'none',
          duration: 2000,
        })
        reject(err);
      },
    })
  })
}

// 拦截器方法
function interceptors(res, resolve, reject, hiddenFailModal) {
  const app = getApp();
  res = res.data;
  const { ok, code } = res;
  if (ok) {
    resolve(res);
    return;
  }
  if (res.code === '10000') {
    app.showModal({
      content: '登陆已失效，请重新登陆',
      confirmText: '重新登陆',
    }).then(
      () => {
        wx.redirectTo({ url: '/pages/login/beforLogin' });
      },
      () => {},
    );
    return;
  }
  reject(res);
  // 其他可配置的条件(取消默认弹窗)
  const checkArr = [];
  if (checkArr.indexOf(res.code) > -1 || hiddenFailModal) return;
  app.showModal({
    hiddenCancel: true,
    content: res.message || '操作失败',
    confirmText: '好的',
  });
}

/**
 * module.exports导出
 * js文件中通过var myAjax = require("/utils/ajax.js")
 */
export default {
  post,
  get,
};