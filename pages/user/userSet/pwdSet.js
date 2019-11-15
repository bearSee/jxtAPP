
const app = getApp()

Page({
  data: {
    formItems: [
      {
        code: '1',
        label: '旧密码',
        type: 'password',
      },
      {
        code: '2',
        label: '新密码',
        type: 'password',
      },
      {
        code: '3',
        label: '确认密码',
        type: 'password',
      },
    ],
  },
  submit({ detail }) {
    console.log(detail.form);
    wx.$http.post('').then(
      () => {},
      () => {},
    );
  },
  onLoad: function () {
  },
})