// pages/user/user.js
const app = getApp()

Page({
  data: {
    basalItem: [
      {
        code: 'touxiang',
        label: '头像',
        type: 'img',
      },
      // {
      //   code: 'receiveObject',
      //   label: '接收对象',
      //   type: 'check',
      //   fastCode: 'Z001000',
      // },
      // {
      //   code: 'messageType',
      //   label: '消息类型',
      //   type: 'radio',
      //   fastCode: 'Z003000',
      // },
      {
        code: 'account',
        label: '账号',
        type: 'text',
      },
      {
        code: 'name',
        label: '昵称',
        type: 'text',
      },
    ],
    basalData: {},
    formItems: [
      {
        code: 'companyName',
        label: '公司名称',
        type: 'text',
      },
      {
        code: 'orgCode',
        label: '机构代码',
        type: 'text',
      },
      {
        code: 'personInCharge',
        label: '负责人',
        type: 'text',
      },
      {
        code: 'fullAdressName',
        label: '地址',
        type: 'tagView',
      },
      {
        code: 'description',
        label: '公司介绍',
        type: 'textarea',
      },
      {
        code: 'industryInfoName',
        label: '所属行业',
        type: 'tagView',
      },
    ],
    formData: {
      industryInfoName: '涤纶-生产/销售运营/n电子设备-生产/销售运营',
      description: '及信通是连接电子产品及啊实打实大所多',
      fullAdressName: '深圳市南山区粤海街道203房',
      personInCharge: '马德逼',
      orgCode: '231231313',
      companyName: '及信通通讯有限公司',
    },
  },
  clickTagView({ detail }) {
    console.log(detail);
  },
  onLoad: function () {
  },
})