//logs.js
var app = getApp();
var { userType } = app.globalData.userInfo;
var isPerson = userType === 'Z001002';
var otherItemInfo = isPerson ? [
  {
    code: 'fullAdressName',
    label: '地址',
    type: 'tag',
  },
] : [];

Page({
  data: {
    /**
     * 
      {
        code: 'receiveObject',
        label: '接收对象',
        type: 'check',
        fastCode: 'Z001000',
      },
      {
        code: 'messageType',
        label: '消息类型',
        type: 'radio',
        fastCode: 'Z003000',
      },
     */
    /**
     * 
      'ADMIN': '管理员',
      'Z001002': '个人用户',
      'Z001001': '企业用户',
     */
    userType,
    type: '',
    infoItems: {
      industryNews: [
        {
          code: 'title',
          label: '标题',
          type: 'text',
          placeholder: '请输入标题',
        },
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
      ],
      recruitmentNews: [
        {
          code: 'title',
          label: '标题',
          type: 'text',
          placeholder: '请输入标题',
        },
        ...otherItemInfo,
        {
          code: 'recruitmentWork',
          label: `${isPerson ? '应聘' : '招聘'}工种`,
          type: 'check',
          options: [],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          fastCode: 'Z004000',
        },
        {
          code: 'recruitmentProfessional',
          label: `${isPerson ? '应聘' : '招聘'}专业`,
          type: 'check',
          options: [],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          fastCode: 'Z005000',
        },
        {
          code: 'recruitmentPosition',
          label: `${isPerson ? '应聘' : '招聘'}岗位`,
          type: 'check',
          options: [],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          fastCode: 'Z006000',
        },
      ],
    },
    formData: {},
    adressVisible: false,
    optionProps: {
      label: 'name',
      value: 'id',
    },
    defaultAdress: [],
  },
  onLoad({ type, id }) {
    this.setData({ type });
    if (id) {
      this.getDetailData(type, id);
    }
  },
  getDetailData(type, id) {
    const obj = {
      industryNews: {
        url: 'industryNews/findById',
        params: {
          industryNewsId: id,
        },
      },
      recruitmentNews: {
        url: 'recruitmentNews/findById',
        params: {
          recruitmentNewsId: id,
        },
      },
    };
    const { url, params } = obj[type];
    wx.$http.post(url, params).then(
      (res) => {
        const formData = res[type] || {};
        this.setData({ formData });
        this.gwtDefaultAdress();
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
  gwtDefaultAdress() {
    const { province, city, area, street, provinceName, cityName, areaName, streetName } = this.data.formData;
    if (!province) return;
    formData.fullAdressName = [provinceName, cityName, areaName, streetName].join(' ');
    const defaultAdress = [province, city, area, street];
    this.setData({ formData, defaultAdress });
  },
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
    const { provinceName, cityName, areaName, streetName } = formData;
    formData.fullAdressName = [provinceName, cityName, areaName, streetName].join(' ');
    this.setData({ formData });
    setTimeout(() => {
      this.closeAdressDialog();
    }, 100);
  },
  formChange({ detail }) {
    const { value, item } = detail;
    const { formData } = this.data;
    if (typeof value === 'object' && Object.prototype.toString.call(value).toLowerCase() === '[object object]') {
      Object.assign(formData, value);
    } else {
      formData[item.code] = value;
    }
    this.setData({ formData });
    console.log('formData', formData);
  },
  industryChange({ detail }) {
    const { industryList } = detail;
    const { formData } = this.data;
    formData.reviceIndustryList = industryList;
    this.setData({ formData });
  },
  submit() {
    this.selectComponent('#choose-industry').change();
    this.finishSubmit();
  },
  finishSubmit() {
    debugger
    const { type, formData } = this.data;
    if (formData.reviceIndustryList && formData.reviceIndustryList.every(d => d.industryLabel)) {
      const params = JSON.parse(JSON.stringify(formData));
      params.reviceIndustryList = JSON.stringify(params.reviceIndustryList);
      let obj;
      if (formData.id) {
        obj = {
          industryNews: {
            url: 'industryNews/update',
          },
          recruitmentNews: {
            url: 'recruitmentNews/update',
          },
        };
      } else {
        obj = {
          industryNews: {
            url: 'industryNews/save',
          },
          recruitmentNews: {
            url: 'recruitmentNews/save',
          },
        };
      }
      wx.$http.post(obj[type].url, params).then(
        () => {
          wx.showToast({
            title: '保存成功',
            mask: true,
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        },
        () => { },
      );
    } else {
      app.showModal({
        content: '请完善行业信息',
        hiddenCancel: true,
      });
    }
  },
})
