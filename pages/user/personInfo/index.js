// pages/user/user.js
const app = getApp()

Page({
  data: {
    /**
     * type
     * title:标题类
     * img：图片类
     * view：只查看类
     * tag：点击跳转类
     */
    personItems: [
      {
        label: '基础信息',
        type: 'title',
      },
      {
        code: 'touxiang',
        label: '头像',
        type: 'img',
      },
      {
        code: 'account',
        label: '账号',
        type: 'view',
      },
      {
        code: 'name',
        label: '姓名',
        inputType: 'text',
        type: 'tag',
      },
      {
        code: 'email',
        label: '电子邮箱',
        inputType: 'text',
        type: 'tag',
      },
      {
        code: 'fullAdressName',
        label: '地址',
        type: 'tag',
      },
      {
        label: '接收行业信息',
        type: 'title',
      },
      {
        code: 'industryInfoName',
        label: '行业名称',
        type: 'tag',
      },
    ],
    companyItems: [
      {
        label: '基础信息',
        type: 'title',
      },
      {
        code: 'touxiang',
        label: '头像',
        type: 'img',
      },
      {
        code: 'account',
        label: '账号',
        type: 'view',
      },
      {
        code: 'name',
        label: '姓名',
        inputType: 'text',
        type: 'tag',
      },
      {
        label: '公司信息',
        type: 'title',
      },
      {
        code: 'companyName',
        label: '公司名称',
        inputType: 'text',
        type: 'tag',
      },
      {
        code: 'orgCode',
        label: '机构代码',
        inputType: 'text',
        type: 'tag',
      },
      {
        code: 'personInCharge',
        label: '负责人',
        inputType: 'text',
        type: 'tag',
      },
      {
        code: 'fullAdressName',
        label: '地址',
        type: 'tag',
      },
      {
        code: 'address',
        label: '详细地址',
        inputType: 'textarea',
        type: 'tag',
      },
      {
        code: 'description',
        label: '公司介绍',
        inputType: 'textarea',
        type: 'tag',
      },
      {
        code: 'industryInfoName',
        label: '所属行业',
        type: 'tag',
      },
    ],
    dataItems: [],
    formData: {},
    saveUrl: '',
    visible: false,
    optionProps: {
      label: 'name',
      value: 'id',
    },
    defaulVal: [],
  },
  getBasicInfo() {
    wx.$http.post('my/info').then(
      ({ info }) => {
        const formData = info || {};
        const { province, city, area, street, provinceName, cityName, areaName, streetName, belongIndustryList } = formData;
        formData.fullAdressName = [provinceName, cityName, areaName, streetName].join(' ');
        if (belongIndustryList && belongIndustryList.length) {
          formData.industryInfoName = belongIndustryList.map(({ industryName }) => industryName).join('、');
        }
        const defaulVal = [province, city, area, street];
        this.setData({ formData, defaulVal });
      },
      () => { },
    );
  },
  clickTagView({ currentTarget }) {
    const { item } = currentTarget.dataset;
    const { type, code } = item;
    const { formData } = this.data;
    if (type === 'img') {
      this.chooseImg();
      return;
    };
    if (type !== 'tag') return;

    // 输入框页面
    let url = `/pages/changeInputData/changeInputData?config=${JSON.stringify(item)}&value=${formData[code] || ''}`;
    // 选中行业信息页面
    if (code === 'industryInfoName') {
      url = '/pages/chooseIndustry/chooseIndustry';
    }
    // 选中省市区街道
    if (code === 'fullAdressName') {
      this.setData({ visible: true });
      return;
    }
    wx.navigateTo({ url });
  },
  chooseImg() {
    wx.chooseImage({
      success: function(res) {
        wx.showToast({
          title: '头像更换功能暂未开放',
          icon: 'none',
          mask: true,
        });
      },
    });
  },
  submit() {
    const { saveUrl, formData } = this.data;
    const params = JSON.parse(JSON.stringify(formData));
    params.belongIndustryList = JSON.stringify(params.belongIndustryList);
    wx.$http.post(saveUrl, params).then(
      () => {
        wx.showToast({ title: '保存成功', mask: true });
        setTimeout(() => {
          this.getBasicInfo();
        }, 1000);
      },
      () => { },
    );
  },
  // 打开弹窗
  openDialog() {
    this.setData({ visible: true });
  },
  // 关闭弹窗
  closeDialog() {
    this.setData({ visible: false });
  },
  handlerConfirm({ detail  }) {
    const { selection } = detail;
    const { formData } = this.data;
    const adressCodes = [
      {
        label: 'provinceName',
        code: 'province',
      },
      {
        label: 'cityName',
        code: 'city',
      },
      {
        label: 'areaName',
        code: 'area',
      },
      {
        label: 'streetName',
        code: 'street',
      },
    ];
    selection.forEach(({ id, name }, i) => {
      formData[adressCodes[i].label] = name || '';
      formData[adressCodes[i].code] = id || '';
    });
    // const { provinceName, cityName, areaName, streetName } = formData;
    // formData.fullAdressName = [provinceName, cityName, areaName, streetName].join(' ');
    this.setData({ formData });
    setTimeout(() => {
      this.closeDialog();
      this.submit();
    }, 100);
  },
  onLoad: function () {
    // 'ADMIN': '管理员',
    // 'Z001002': '个人用户',
    // 'Z001001': '企业用户',
    const { userInfo } = app.globalData;
    const { personItems, companyItems } = this.data;
    const dataItems = userInfo.userType === 'Z001001' ? companyItems : personItems;
    const saveUrl = userInfo.userType === 'Z001001' ? 'my/company/save' : 'my/personal/save';
    this.setData({
      dataItems,
      saveUrl,
    });
    this.getBasicInfo();
  },
})