
const { getTimeData, getDateStr, getDateArr } = require('../es/dateTimePicker.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: '',
      observer() {
        this.getCreatedData();
      },
    },
    start: {
      type: Number,
      value: 2000,
    },
    end: {
      type: Number,
      value: 2050,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    showSecond: {
      type: Boolean,
      value: false,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    dataList: [],
    indexList: [],
  },

  ready: function () {
    const { start, end, showSecond } = this.properties;
    // 获取年月日时分秒初始数组dataList
    const { dataList } = getTimeData(start, end);
    if (!showSecond) dataList.pop();
    this.setData({ dataList });
    this.getCreatedData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getCreatedData() {
      const { value, showSecond } = this.properties;
      let indexList = getDateArr(value);
      // if (!showSecond) indexList.pop();
      this.setData({ indexList });
    },
    changeDateTime({ detail }) {
      const indexList = detail.value;
      const value = getDateStr(indexList);
      this.setData({ indexList });
      this.triggerEvent('input', { value });
    },
  },
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除