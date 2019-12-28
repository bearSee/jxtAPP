const app = getApp();
var { userType } = app.globalData.userInfo;
var isPerson = userType === 'Z001002';

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    tabs: {
      type: Array,
      value: [
        {
          name: `${isPerson ? '应聘' : '招聘'}消息`,
          code: 'recruitmentNews',
        },
        {
          name: '行业消息',
          code: 'industryNews',
        },
      ],
      observer() {
        // this.initCurrentTab();
      },
    },
    selected: {
      type: String,
      value: '',
    },
  },
  data: {
    currentCode: '',
  },
  ready: function () {
    this.initCurrentTab();
  },
  methods: {
    initCurrentTab() {
      const { tabs, selected } = this.properties;
      if (tabs && tabs.length) {
        const currentTab = tabs.find(d => d.code === selected) || tabs[0];
        const currentCode = currentTab.code;
        this.setData({ currentCode });
        this.triggerEvent('change', { code: currentCode });
      }
    },
    change({ currentTarget }) {
      const { code } = currentTarget.dataset;
      const { currentCode } = this.data;
      if (code !== currentCode) {
        this.setData({ currentCode: code });
        this.triggerEvent('change', { code });
      }
    },
  },
});