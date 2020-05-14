var app = getApp();

Page({
  data: {
    type: 'industryNews',
    infoItems: [
      {
        code: 'receiveObject',
        label: '接收对象',
        type: 'check',
        options: [],
        optionProps: {
          label: 'value',
          value: 'key',
        },
        fastCode: 'Z001000',
        value: 'Z001001,Z001002',
      },
      {
        code: 'messageType',
        label: '消息类型',
        type: 'check',
        options: [],
        optionProps: {
          label: 'value',
          value: 'key',
        },
        fastCode: 'Z003000',
      },
      {
        code: 'fullAdressName',
        label: '接收地址',
        type: 'tag',
      }
    ],
    formData: {},
    adressVisible: false,
    optionProps: {
      label: 'name',
      value: 'id',
    },
    defaultAdress: [],
  },
  onLoad(options) {
    this.getDetailData();
  },
  // 若为编辑，通过id获取数据
  getDetailData() {
    wx.$http.post('receiveSetting/industry/info', {}).then(
      ({ data }) => {
        const formData = data || {};
        // 后台字段错误，不统一，额外处理
        if (formData.reviceIndustryList) {
          formData.receiveIndustryList = JSON.parse(JSON.stringify(formData.reviceIndustryList));
          delete formData.reviceIndustryList;
        }
        this.setData({ formData });
        this.getDefaultAdress();
      },
      () => { },
    );
  },
  // 打开地址选择弹窗
  openAdressDialog() {
    this.setData({ adressVisible: true });
  },
  // 关闭地址选择弹窗
  closeAdressDialog() {
    this.setData({ adressVisible: false });
  },
  // 获取默认地址，显示地址名
  getDefaultAdress() {
    const { formData } = this.data;
    const { province, city, area, street, provinceName, cityName, areaName, streetName } = this.data.formData;
    if (!(province && provinceName)) return;
    formData.fullAdressName = [provinceName, cityName, areaName, streetName].join(' ');
    const defaultAdress = [province, city, area, street];
    this.setData({ formData, defaultAdress });
  },
  // 修改地址
  changeAdress({ detail }) {
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
    this.setData({ formData });
    setTimeout(() => {
      this.getDefaultAdress();
      this.closeAdressDialog();
    }, 100);
  },
  // 表单修改
  formChange({ detail }) {
    const { formData } = this.data;
    const { value, item } = detail;
    if (typeof value === 'object' && Object.prototype.toString.call(value).toLowerCase() === '[object object]') {
      Object.assign(formData, value);
    } else {
      formData[item.code] = value;
    }
    this.setData({ formData });
  },
  // 行业修改
  industryChange({ detail }) {
    const { industryList } = detail;
    const { formData } = this.data;
    formData.receiveIndustryList = industryList;
    this.setData({ formData });
  },
  // 点击提交
  submit() {
    this.selectComponent('#choose-industry').change();
    this.finishSubmit();
  },
  // 提交表单数据
  finishSubmit() {
    const { formData, type } = this.data;
    if (this.checkFormData()) {
      const params = JSON.parse(JSON.stringify(formData));

      const receiveIndustryList = params.receiveIndustryList.map(({ industryLabel, industryName, industryId, id }) => ({
        industryLabel,
        industryName,
        industryId: industryId || id,
      }));
      params.receiveIndustryList = JSON.stringify(receiveIndustryList);
      const url = type === 'industryNews' ? 'receiveSetting/industry/save' : 'receiveSetting/recruitment/save';

      wx.showLoading({
        title: '保存中...',
      });
      wx.$http.post(url, params).then(
        () => {
          wx.showToast({
            title: '保存成功',
            mask: true,
          });
          wx.hideLoading();
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        },
        () => {
          wx.hideLoading();
        },
      );
    }
  },
  checkFormData() {
    const { formData } = this.data;
    if (formData.receiveIndustryList && formData.receiveIndustryList.every(d => d.industryLabel)) {
      return true;
    } else {
      app.showModal({
        content: '请完善行业信息',
        hiddenCancel: true,
      });
      return false;
    }
  },
})
