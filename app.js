
import http from "utils/ajax.js";
wx.$http = http;

App({
  // 全局数据
  globalData: {
    openid: '',
    userInfo: {},
    // appid: wx811778012413f270
    // 测试地址
    host: 'https://www.szzdxx.cn/jixintong/',
    fileHead: 'https://www.szzdxx.cn/jixintong/',
  },
  // 首次启动调用
  onLaunch: function () {
    // 封装的ajax方法里在该页面拿的host，首次启动直接掉接口可能会出现调不通的情况，因为数据初始化尚未完成(若非要在这里调用，需在ajax文件里手动配置host)
  },
  // 每次显示页面调用
  onShow: function (options) {
  },
  // 登录
  userLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          const { code } = res;
          wx.$http.post('wechatMini/uploadJsCode', { code }, true).then(
            res => {
              console.log('userLogin', res)
              this.finishLogin(res);
              resolve(res);
            },
            err => {
              reject(err);
            }
          );
        }
      });
    });
  },
  // 登陆完成处理
  finishLogin({ user, openid, Authorization }) {
    wx.setStorageSync('Authorization', Authorization);
    this.globalData.userInfo = user;
    if (openid) this.globalData.openid = openid;
    wx.reLaunch({ url: '/pages/myReceive/myReceive' });
  },
  // 退出登录
  loginOut() {
    wx.$http.post('/init/logout').then(
      () => {
        wx.showToast({ title: '退出登录成功' });
        wx.setStorageSync('Authorization', '');
        this.globalData.userInfo = {};
        this.globalData.openid = '';
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/login/beforeLogin' });
        }, 1000);
      },
      () => { },
    );
  },
  // 弹窗封装
  showModal(data) {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: data.tltle || '温馨提示',
        content: data.content || '',
        confirmColor: data.confirmColor || '#4285F4',
        cancelColor: data.cancelColor || '',
        showCancel: !data.hiddenCancel,
        cancelText: data.cancelText || '取消',
        confirmText: data.confirmText || '确定',
        success: res => {
          if (res.confirm) {
            resolve();
          }
          reject();
        }
      })
    })
  },
  // 拉取授权页面
  getAccreditPage(type) {
    if (!type)  return;
    return new Promise((resolve, reject) => {
      const that = this;
      wx.getSetting({
        success(res) {
          if (res.authSetting[type] !== undefined && res.authSetting[type] !== true) {
            wx.openSetting({
              success: function (dataAu) {
                if (dataAu.authSetting[type] == true) {
                  resolve(res);
                } else {
                  reject();
                }
              }
            })
          } else if (res.authSetting[type] === undefined) {
            wx.authorize({
              scope: type,
              success() {
                resolve(res);
              }
            })
          }
          else {
            resolve(res);
          }
        },
        fail(res) {
          wx.authorize({
            scope: type,
            success() {
              resolve(res);
            }
          })
        }
      })
    })
  },
  // 预览附件
  attachmentPreview(filePath) {
    if (!filePath) {
      wx.showToast({
        title: '此票据无附件或者附件为空',
        icon: 'none',
      })
      return;
    }
    const fullPath = this.globalData.fileHead + filePath;
    const fileFormat = filePath.substr(filePath.lastIndexOf('.') + 1);
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileFormat.toLowerCase())) {
      wx.downloadFile({
        url: fullPath,
        success: function (res) {
          wx.openDocument({ filePath: res.tempFilePath });
        },
      })
      return;
    }
  },
})

