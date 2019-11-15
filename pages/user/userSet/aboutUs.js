
const app = getApp()

Page({
  data: {
    list: [
      {
        labelName: '联系电话',
        value: '0755-26882342',
        hiddenArrow: true,
      },
      {
        labelName: '邮箱',
        value: 'xiaobzaizi@jxtsoft.com.cn',
        hiddenArrow: true,
      },
    ],
    version: 'v1.0.0',
    introduce: '及信通是连接电子产品及其相关行业的平台.从产品营销,开发设计,生产及相关行业中的机械设备,五金,注塑模具,塑胶颜料,电子元器件,仪表仪器,电池, PCB线路板,邦定,热熔,超声,包装印刷,外观,辅料等相互间之需求, 资源整合,新产品，新工艺，招聘等的智能服务。',
  },
  onLoad: function () {
  },
})