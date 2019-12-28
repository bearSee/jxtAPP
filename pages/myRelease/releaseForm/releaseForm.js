var app = getApp();

Page({
  data: {
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
        {
          code: 'recruitmentWork',
          label: '招聘工种',
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
          label: '招聘专业',
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
          label: '招聘岗位',
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
    if (id) {
      this.getDetailData(type, id);
    }

    const { userType } = app.globalData.userInfo;
    const isPerson = userType === 'Z001002';
    if (isPerson && type === 'recruitmentNews') {
      const { infoItems } = this.data;
      infoItems[type].splice(1, 0, {
        code: 'fullAdressName',
        label: '地址',
        type: 'tag',
      });
      infoItems[type].map((d) => {
        if (d.label.includes('招聘')) {
          d.label = d.label.replace(/招聘/i, '应聘');
        }
        return d;
      });
      this.setData({ infoItems });
    }
    this.setData({ type });
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
        if (formData.reviceIndustryList) {
          formData.receiveIndustryList = JSON.parse(JSON.stringify(formData.reviceIndustryList));
          delete formData.reviceIndustryList;
        }
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
    const { formData } = this.data;
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
    const { formData } = this.data;
    const { value, item } = detail;
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
    formData.receiveIndustryList = industryList;
    this.setData({ formData });
  },
  submit() {
    this.selectComponent('#choose-industry').change();
    this.finishSubmit();
  },
  finishSubmit() {
    const { type, formData } = this.data;
    if (formData.receiveIndustryList && formData.receiveIndustryList.every(d => d.industryLabel)) {
      const params = JSON.parse(JSON.stringify(formData));
      params.receiveIndustryList = JSON.stringify(params.receiveIndustryList);
      let obj;
      if (params.id) {
        obj = {
          industryNews: {
            url: 'industryNews/update',
            id: 'industryNewsId',
          },
          recruitmentNews: {
            url: 'recruitmentNews/update',
            id: 'recruitmentNewsId',
          },
        };
        params[obj[type].id] = params.id;
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
      console.log('params', params)
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
