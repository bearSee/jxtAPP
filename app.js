
import http from "utils/ajax.js";
wx.$http = http;

App({
  // 全局数据
  globalData: {
    logined: false,
    tabs: [],
    mobile: '',
    openid: '',
    userInfo: {},
    content: '',
    /**
     * loginType
     * 0: 未登录
     * 1: 账号密码登陆
     * 2: 快捷登录
     */
    loginType: '0',
    // appid: wx811778012413f270
    // 测试地址
    host: 'https://www.szzdxx.cn/jixintong/',
    fileHead: 'https://www.szzdxx.cn/jixintong/',
  },
  // 首次启动调用
  onLaunch: function () {
    this.upDateApp();
    // 封装的ajax方法里在该页面拿的host，首次启动直接掉接口可能会出现调不通的情况，因为数据初始化尚未完成(若非要在这里调用，需在ajax文件里手动配置host)
  },
  // 每次显示页面调用
  onShow: function (options) {
    this.getTabsTitle();
  },
  // 更新版本，清除缓存
  upDateApp() {
    // 判断当前微信版本是否支持版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(({ hasUpdate }) => {
        // 请求完新版本信息的回调
        if (hasUpdate) {
          updateManager.onUpdateReady(() => {
            this.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
            }).then(() => {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            });
          });
          updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
            this.showModal({
              title: '更新提示',
              content: '新版本已经上线，请您删除当前小程序，重新搜索打开',
            });
          });
        }
      })
    } else {
      this.showModal({
        title: '更新提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试',
      });
    }
  },
  // 获取行业消息、招聘消息标题栏
  getTabsTitle() {
    wx.request({
      url: 'https://www.szzdxx.cn/image/title.json',
      success: ({ data }) => {
        const { industryNews, recruitmentNews } = data || {};
        this.globalData.tabs = [
          {
            name: industryNews.title || '',
            code: 'industryNews',
            icon: 'hy.png',
          },
          {
            name: recruitmentNews.title || '',
            code: 'recruitmentNews',
            icon: 'zp.png',
          },
        ];
      },
      fail: () => {
        this.globalData.tabs = [
          {
            name: '行业消息',
            code: 'industryNews',
            icon: 'hy.png',
          },
          {
            name: '招聘消息',
            code: 'recruitmentNews',
            icon: 'zp.png',
          },
        ];
      },
    });
  },
  // 登录
  userLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          const { code: jscode } = res;
          wx.$http.post('wechatmini/uploadjscode', { jscode }, { hiddenErrModal: true }).then(
            ({ data }) => {
              const openid = data.openid || data.openId;
              const mobile = data.mobile || '';
              if (openid) this.globalData.openid = openid;
              if (mobile) this.globalData.mobile = mobile;
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
  // 手机号快捷登录
  mobileLogin(data) {
    if (!(data && data.mobile)) return;
    wx.$http.post('wechatmini/login/mobile', data, { hiddenErrModal: true }).then(
      ({ data }) => {
        this.finishLogin(data, '2');
      },
      err => {
        if (err.code === '10006') {
          this.showModal({
            content: '当前用户暂未注册，请先完成注册',
            hiddenCancel: true,
          }).then(() => {
            wx.navigateTo({ url: '/pages/register/register' });
          });
        } else {
          this.showModal({
            content: err.message || '登录失败，请稍后重试',
            hiddenCancel: true,
          });
        }
      },
    );
  },
  // 登陆完成处理
  finishLogin({ user, openid, Authorization }, loginType = '1') {
    if (user && user.userType === 'ADMIN') {
      this.showModal({
        content: '管理员请登陆PC端进行操作',
        hiddenCancel: true,
      });
      return;
    }
    this.globalData.logined = true;
    wx.setStorageSync('Authorization', Authorization);
    this.globalData.userInfo = user;
    this.globalData.loginType = loginType;
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
          this.globalData.logined = false;
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
        title: '附件为空',
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

