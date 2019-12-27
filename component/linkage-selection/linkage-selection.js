
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
    // 步骤总数
    steps: {
      type: Number,
      value: 4,
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
    currentList: [],
    currentStep: 1,
    selection: [],
    indexList: [],
  },
  
  ready: function () {
    this.initSelect();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取当前步骤的列表数据,默认选中第一条数据
    getCurrentStepList(notSetList) {
      return new Promise((resolve, reject) => {
        const { requestUrl, parentKey, optionProps, defaultParamCode, value } = this.properties;
        const { selection, indexList, currentStep } = this.data;
        // 获取上一个选中的数据
        const paramData = selection[currentStep - 2];
        const params = {
          [parentKey]: (paramData && paramData[[optionProps.value]]) || defaultParamCode || 0,
        };
        wx.$http.post(requestUrl, params, { hiddenLoading: notSetList }).then(
          ({ list }) => {
            list = list.length && list || [{
              [optionProps.label]: '暂无数据',
            }];
            const currentList = list;
            // 当前步骤没有值的话，默认选中第一条
            if (!selection[currentStep - 1]) {
              let index = list.findIndex(d => d[optionProps.value] === value[currentStep - 1]);
              index = index > -1 ? index : 0;
              selection[currentStep - 1] = list[index] || {};
              indexList[currentStep - 1] = index;
            }
            this.setData({ selection, indexList });
            if (!notSetList) {
              this.setData({ currentList });
            }
            resolve({ currentList, indexList });
          },
          () => {
            reject();
          },
        );
      });
    },
    // 初始化选中
    initSelect() {
      const { value } = this.properties;
      let { currentStep, selection } = this.data;
      wx.showLoading({ title: '正在加载初始数据' });
      if (value && value.length &&  value.length >= currentStep) {
        this.getCurrentStepList(true).then(
          ({ currentList, indexList }) => {
            if (value.length === currentStep) {
              this.setData({ currentList });
              this.setData({ indexList });
              wx.hideLoading();
              return;
            };
            currentStep += 1;
            this.setData({ currentStep });
            this.initSelect();
          },
          () => {},
        );
      } else if (!selection.length) {
        this.getCurrentStepList();
        wx.hideLoading();
      }
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
    submit() {
      const { selection } = this.data;
      this.triggerEvent('handlerConfirm', { selection });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除