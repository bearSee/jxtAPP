
const app = getApp()

Page({
  data: {
    formItems: [
      {
        code: 'oldPwd',
        label: '旧密码',
        type: 'password',
      },
      {
        code: 'pwd1',
        label: '新密码',
        type: 'password',
      },
      {
        code: 'pwd2',
        label: '确认密码',
        type: 'password',
      },
    ],
  },
  submit({ detail }) {
    wx.$http.post('my/resetPassword', detail.form).then(
      () => {
        wx.navigateBack();
        wx.showToast({ title: '修改成功', mask: true });
      },
      () => {},
    );
  },
  onLoad: function () {
  },
})