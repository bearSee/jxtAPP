
const app = getApp()

Page({
  data: {
    list: [
      {
        iconName: 'ri-smartphone-line',
        labelName: '密码设置',
        url: '/pages/user/userSet/pwdSet',
      },
      {
        iconName: 'ri-smartphone-line',
        labelName: '关于我们',
        url: '/pages/user/userSet/aboutUs',
      },
    ],
  },
  clickView({ detail }) {
    const { url } = detail;
    wx.navigateTo({ url });
  },
  loginOut() {
    app.showModal({ content: '确定退出登录?' }).then(() => {
      app.loginOut();
    });
  },
  onLoad: function () {
  },
})