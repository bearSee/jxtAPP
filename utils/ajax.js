
/**
 * POST请求，
 * URL：接口
 */
// config: hiddenErrModal, hiddenLoading, header
function post(url, data, config = {}) {
  const { hiddenErrModal, hiddenLoading, header } = config;
  return new Promise((resolve, reject) => {
    requestBody('post', url, data, header, hiddenErrModal, hiddenLoading, resolve, reject);
  })
}
function get(url, config = {}) {
  const { hiddenErrModal, hiddenLoading, header } = config;
  return new Promise((resolve, reject) => {
    requestBody('get', url, {}, header, hiddenErrModal, hiddenLoading, resolve, reject);
  })
}

function requestBody(type, url, data, header, hiddenErrModal, hiddenLoading, resolve, reject) {
  if (url[0] === '/') url = url.substring(1);
  const typeObj = {
    get: 'GET',
    post: 'POST',
  };
  const app = getApp();
  const { host, cookie } = app.globalData;
  const Authorization = wx.getStorageSync('Authorization') || '';
  if (!hiddenLoading) {
    wx.showLoading({ title: '加载中', mask: true });
  }
  wx.request({
    url: host + url,
    header: { 'content-type': 'application/x-www-form-urlencoded', Authorization, Cookie: `ZTESSCAUTH=${cookie || ''};path=/;`, ...(header || {}) },
    data,
    method: typeObj[type],
    success: ({ data }) => {
      wx.hideLoading();
      interceptors(data, resolve, reject, hiddenErrModal);
    },
    fail: (err) => {
      wx.hideLoading();
      wx.showToast({ title: '啊噢，好像服务器遇上了点问题', icon: 'none', duration: 2000 });
      reject(err);
    },
  })
};
// 拦截器方法
function interceptors(res, resolve, reject, hiddenErrModal) {
  const app = getApp();
  if (res.ok) {
    resolve(res);
    return;
  }
  reject(res);
  if (hiddenErrModal) return;
  app.showModal({
    hiddenCancel: true,
    content: res.message || '后台接口请求失败，请联系后台人员',
    confirmText: '好的',
  }).then(() => {
    if (res.code === '10000') {
      wx.redirectTo({
        url: '/pages/login/beforeLogin',
      });
    }
  });
}

/**
 * module.exports导出
 * js文件中通过var myAjax = require("/utils/ajax.js")
 */
export default { post, get };
