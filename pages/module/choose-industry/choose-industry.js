
var app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 初始数据
    data: {
      type: Array,
      value: () => ([]),
      observer() {
        this.initData();
      },
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    oprate: {
      type: Boolean,
      value: false,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    wholeTree: [],
    industryList: [],
    // 标签选择trans
    industryTrans: [
      {
        from: 'value',
        to: 'industryLabelName',
      },
    ],
    industryIndex: 0,
    selectedIndustry: {},
  },
  
  ready: function () {
    this.getTreeData();
    this.initData();
  },
  /**
   * 组件的方法列表
   * 
      [{
        industryLabelName: '',
        "industryLabel": "Z002007,Z002005,Z002006,Z002001,Z002004,Z002002,Z002003",
        "industryName": "电子产品",
        "industryId": "101"
        industryLabelAll: [{value: "生产", key: "Z002001"}]
      }, {
        "industryLabel": "Z002005,Z002001,Z002006,Z002003,Z002002,Z002004",
        "industryName": "电池",
        "industryId": "106"
      }]
   */
  methods: {
    getTreeData() {
      wx.$http.post('industry/list').then(
        ({ list }) => {
          const wholeTree = list[0] && list[0].children || [];
          this.setData({ wholeTree });
        },
        () => { },
      );
    },
    // 初始化数据
    initData() {
      const { data } = this.properties;
      const industryList = data && data.length && data || [{}];
      this.setData({ industryList });
      // this.change();
    },
    // 标签选择
    checkChange({ detail, currentTarget }) {
      const { index } = currentTarget.dataset;
      const { industryList } = this.data;
      industryList[index] = { ...industryList[index], ...detail.value };
      this.setData({ industryList });
      this.change();
    },
    // 新增行业
    addIndustry() {
      const { industryList } = this.data;
      industryList.push({});
      this.setData({ industryList });
      this.change();
    },
    // 删除行业
    deletIndustry({ currentTarget }) {
      const { index } = currentTarget.dataset;
      const { industryList } = this.data;
      industryList.splice(index, 1);
      this.setData({ industryList });
      this.change();
    },
    change() {
      const { industryList } = this.data;
      setTimeout(() => {
        this.triggerEvent('handlerChange', { industryList });
      }, 100);
    },
    submit() {
      const { industryList } = this.data;
      setTimeout(() => {
        this.triggerEvent('handlerConfirm', { industryList });
      }, 100);
    },
    conmeBack() {
      setTimeout(() => {
        this.triggerEvent('close');
      }, 100);
    },
    // 修改行业
    changeIndustry({ currentTarget }) {
      const { index: industryIndex } = currentTarget.dataset;
      this.setData({ industryIndex });
      this.openDialog();
    },
    // 点击选择行业
    checkIndustryList({ currentTarget }) {
      const { data, findex, sindex, tindex } = currentTarget.dataset;
      const { wholeTree } = this.data;
      if (tindex > -1) {
        wholeTree[findex].children[sindex].children[tindex].open = !wholeTree[findex].children[sindex].children[tindex].open;
      } else if (sindex > -1) {
        wholeTree[findex].children[sindex].open = !wholeTree[findex].children[sindex].open;
      } else if (findex > -1) {
        wholeTree[findex].open = !wholeTree[findex].open;
      }
      const selectedIndustry = JSON.parse(JSON.stringify(data));
      if (selectedIndustry.children) {
        delete selectedIndustry.children
      }
      this.setData({
        selectedIndustry,
        wholeTree,
      });
    },
    // 保存行业选择
    saveChange() {
      const { selectedIndustry, industryIndex, industryList } = this.data;
      if (industryList.find(d => d.id === selectedIndustry.id)) {
        app.showModal({
          content: '列表中已存在该行业，请重新选择',
          hiddenCancel: true,
        });
        return;
      }
      industryList[industryIndex] = selectedIndustry;
      setTimeout(() => {
        this.closeDialog();
        this.setData({ industryList });
        this.change();
      }, 100);
    },
    // 打开弹窗
    openDialog() {
      this.setData({ visible: true });
    },
    // 关闭弹窗
    closeDialog() {
      this.setData({ visible: false });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除