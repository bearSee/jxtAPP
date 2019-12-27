
var app = getApp();
Component({
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
    // 请求的接口
    requestUrl: {
      type: String,
      value: '',
    },
    // 请求参数的key的名字
    parentKey: {
      type: String,
      value: '',
    },
    optionProps: {
      type: Object,
      value: () => ({
        label,
        value,
      }),
    },
    value: {
      type: Array,
      value: () => ([]),
      // observer() {
      //   this.initSelect();
      // },
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    industryList: [],
  },
  
  ready: function () {
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
    // 初始化数据
    initData() {
      const { data } = this.properties;
      const industryList = data.length && data || [{}];
      this.setData({ industryList });
    },
    // 标签选择
    checkChange({ detail }) {
      
    },

    // 选择当前步骤之前的步骤时
    chooseStep({ currentTarget }) {
      const { step } = currentTarget.dataset;
      let { currentStep } = this.data;
      if (step < currentStep) {
        this.initSelection(step);
      }
    },
    // 当前步骤改变时清空当前步骤之后的选中数据
    initSelection(step) {
      let { selection, indexList } = this.data;
      selection = selection.slice(0, step);
      indexList = indexList.slice(0, step);
      this.setData({ selection, indexList, currentStep: step });
      this.getCurrentStepList();
    },
    chooseNextStep() {
      const { steps } = this.properties;
      let { currentStep } = this.data;
      if (currentStep < steps) {
        currentStep += 1;
        this.setData({ currentStep });
        this.getCurrentStepList();
      } else {
        this.submit();
      }
    },
    // 选择change
    selectChange ({ detail  }) {
      const { selection, indexList, currentStep, currentList } = this.data;
      const index = detail.value[0];
      selection[currentStep - 1] = currentList[index];
      indexList[currentStep - 1] = index;
      this.setData({ selection, indexList });

      this.triggerEvent('selectChange', { index, item: currentList[index] });
    },
    add() {},
    save() {
      const {  } = this.data;
      this.triggerEvent('handlerConfirm', {  });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除