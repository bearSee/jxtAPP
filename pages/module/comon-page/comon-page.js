const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /**
     * type：
     * collect 我的收藏
     * release 我的发布
     * receive 我的接收
     */
    pageType: {
      type: String,
      value: 'release',
    },
  },
  data: {
    visible: false,
    tabs: [
      {
        name: '行业消息',
        code: 'industryNews',
        icon: 'hy.png',
      },
      {
        name: '招聘消息',
        code: 'recruitmentNews',
        icon: 'zp.png',
      },
    ],
    type: 'industryNews',
    title: '',
    msgList: [],
    pageSize: 20,
    loadingWord: '',
    config: {
      collect: {
        industryNews: {
          getListUrl: 'collection/industryNews/list',
          deleListUral: 'collection/delete',
        },
        recruitmentNews: {
          getListUrl: 'collection/recruitmentNews/list',
          deleListUral: 'collection/delete',
        },
      },
      release: {
        industryNews: {
          getListUrl: 'industryNews/list',
          deleListUral: 'industryNews/delete',
        },
        recruitmentNews: {
          getListUrl: 'recruitmentNews/list',
          deleListUral: 'recruitmentNews/delete',
        },
      },
      receive: {
        industryNews: {
          getListUrl: 'receiveNews/industry/list',
          deleListUral: '',
        },
        recruitmentNews: {
          getListUrl: 'receiveNews/recruitment/list',
          deleListUral: '',
        },
      },
    },
  },
  ready: function () {
    const { userType } = app.globalData.userInfo;
    const isPerson = userType === 'Z001002';
    if (isPerson) {
      const { tabs } = this.data;
      tabs.map((d) => {
        if (d.name.includes('招聘')) {
          d.name = d.name.replace(/招聘/i, '应聘');
        }
        return d;
      });
      this.setData({ tabs });
    }
  },
  methods: {
    // 清空输入，初始化列表
    clearInput() {
      this.setData({ title: '' });
      this.initList();
    },
    // 搜索
    search({ detail }) {
      const { value: title } = detail;
      this.setData({ title });
      this.initList();
    },
    // tab栏change事件，初始化列表
    tabsChange({ detail }) {
      const { code: type } = detail;
      this.setData({ type });
      this.initList();
    },
    // 获取list列表
    getList() {
      const { pageType } = this.properties;
      const { config, type, title } = this.data;
      const url = config[pageType][type].getListUrl;
  
      this.hiddenDel()
      this.setData({ loadingWord: '正在加载' });
      wx.$http.post(url, {
        pageNum: 1,
        pageSize: 10,
        title,
      }).then(
        ({ list, total }) => {
          const msgList = list || [];
          this.setData({
            msgList,
            loadingWord: list.length < total ? '上拉加载更多' : '已全部加载',
          });
        },
        () => { },
      );
    },
    // 收藏、拉黑、举报
    oprate({ detail }) {
      this.hiddenDel()
      const { item, type } = detail;
      const { id, userId, newsId } = item;
  
      if (type === 'edit') {
        const currentTarget = {
          dataset: {
            type: this.data.type,
            id,
          },
        };
        this.chooseReleaseType({ currentTarget });
        return;
      }
  
      if (type === 'delete') {
        this.handlerDelete({ detail: { item } });
        return;
      }
  
      const obj = {
        isBlacklist: {
          'N': {
            url: 'blacklist/save',
            warningTips: '是否将该用户添加至黑名单?',
            successTips: '添加黑名单成功',
            params: {
              blackUserId: userId,
            },
          },
          'Y': {
            url: 'blacklist/delete',
            successTips: '黑名单已取消',
            params: {
              blackUserId: userId,
            },
          },
        },
        isCollection: {
          'N': {
            url: 'collection/save',
            successTips: '收藏成功',
            params: {
              newsId: id || newsId,
            },
          },
          'Y': {
            url: 'collection/delete',
            successTips: '已取消收藏',
            params: {
              newsId: id || newsId,
            },
          },
        },
        isComplaint: {
          'N': {
            url: 'complaint/submit',
            warningTips: '是否举报该用户?',
            successTips: '举报成功',
            params: {
              newsId: id || newsId,
            },
          },
        }
      };
      const currentState = item[type] || 'N';
      if (!obj[type][currentState]) return;
  
      const url = obj[type][currentState].url;
      const params = obj[type][currentState].params;
      const successTips = obj[type][currentState].successTips;
      const warningTips = obj[type][currentState].warningTips;
  
      if (warningTips) {
        app.showModal({ content: obj[type][currentState].warningTips }).then(
          () => {
            this.handlerOprate({ url, params, successTips });
          },
          () => { },
        );
        return;
      }
      this.handlerOprate({ url, params, successTips });
    },
    handlerOprate({ url, params, successTips }) {
      wx.$http.post(url, params).then(
        () => {
          wx.showToast({ title: successTips });
          setTimeout(() => {
            this.getList();
          }, 1000);
        },
        () => { },
      );
    },
    // 删除消息
    handlerDelete({ detail }) {
      const { item } = detail;
      const { pageType } = this.properties;
      const { config, type } = this.data;
      const url = config[pageType][type].deleListUral;
      const params = {
        industryNews: { industryNewsId: item.id },
        recruitmentNews: { recruitmentNewsId: item.id },
      };
      app.showModal({ content: '是否删除该条数据' }).then(
        () => {
          wx.$http.post(url, params[type]).then(
            () => {
              wx.showToast({ title: '删除成功' });
              setTimeout(() => {
                this.getList();
              }, 1000);
            },
            () => { },
          );
        },
        () => {
          this.hiddenDel()
        },
      );
    },
    // 打开弹窗
    openDialog() {
      this.setData({ visible: true });
      this.hiddenDel()
    },
    // 关闭弹窗
    closeDialog() {
      this.setData({ visible: false });
    },
    // 点击发布消息跳转选择
    chooseReleaseType({ currentTarget }) {
      const { type, id } = currentTarget.dataset;
      wx.navigateTo({ url: `/pages/myRelease/releaseForm/releaseForm?type=${type}&id=${id || ''}` });
      setTimeout(() => {
        this.setData({ visible: false });
      }, 100);
    },
    // 查看消息详情
    clickList({ detail }) {
      const { type } = this.data;
      const { id, newsId } = detail;
      wx.navigateTo({ url: `/pages/messageDetail/messageDetail?type=${type}&id=${id || newsId}&skipFrom=${this.properties.pageType}` });
    },
    // 查看消息通知
    viewNotice() {
      wx.navigateTo({ url: '/pages/notices/notices' });
    },
    // 恢复列表左滑距离
    hiddenDel() {
      if (this.selectComponent('#list')) {
        this.selectComponent('#list').hiddenDel();
      }
    },
    // 初始化列表
    initList() {
      const { title } = this.data;
      this.setData({
        title,
        pageSize: 10,
      });
      this.getList();
    },
    // 上拉加载更多
    getNextPage() {
      let { pageSize } = this.data;
      pageSize += 10;
      this.setData({ pageSize });
      this.getList();
    },
  },
  // // 触发上拉加载
  // onReachBottom: function () {
  //   this.getNextPage();
  // },
  // // 页面隐藏时
  // onUnload() {
  //   this.hiddenDel();
  // },
})
