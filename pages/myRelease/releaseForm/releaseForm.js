//logs.js
const util = require('../../../utils/ajax.js');
var app = getApp();
var { userType } = app.globalData.userInfo;
var isPerson = userType === 'Z001002';

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
        },
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
          fastCode: 'Z005000',
        },
        {
          code: 'recruitmentPosition',
          label: `${isPerson ? '应聘' : '招聘'}岗位`,
          type: 'check',
          fastCode: 'Z006000',
        },
      ],
    },
    formData: {},
  },
  onLoad({ type, id }) {
    this.setData({ type });
    this.getDetailData(type, id);
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
        const formData = res[type];
        this.setData({ formData });
      },
      () => { },
    );
  },
  formChange({ detail }) {
    const { value, item } = detail;
    const { formData } = this.data;
    formData[item.code]
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
    console.log('formData', formData);
  },
  submit() {
    this.selectComponent('#choose-industry').submitChange();
  },
})
