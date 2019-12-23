const app = getApp();
var timer = null;

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    tabs: {
      type: Array,
      value: [
        {
          name: '招聘消息',
          code: 'industryNews',
        },
        {
          name: '行业消息',
          code: 'recruitmentNews',
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