
var dateTimePicker = require('../../utils/dateTimePicker.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      value: '',
    },
    start: String,
    end: String,
    disabled: {
      type: Boolean,
      value: false,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    dateTimeArray: null,
    dateTime: null,
  },

  ready: function () {
    const dateTimeArray = this.getCreateArrData().dateTimeArray;
    let dateTime = this.getCreateArrData().dateTime;
    let value = dateTimePicker.changeDateStyle(dateTime);
    if (this.properties.value) {
      value = this.properties.value;
      dateTime = this.getValue(value);
    }
    this.setData({ dateTime, dateTimeArray });
    this.triggerEvent('input', { value });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeDateTime(e) {
      const dateTime = e.detail.value;
      const value = dateTimePicker.changeDateStyle(e.detail.value);
      this.setData({ dateTime });
      this.triggerEvent('input', { value });
    },
    getCreateArrData() {
      const start = this.properties.start || 2000;
      const end = this.properties.end || 2050;
      // 获取完整的年月日 时分秒，以及默认显示的数组
      const obj = dateTimePicker.dateTimePicker(start, end);
      // 精确到分的处理，将数组的秒去掉
      obj.dateTimeArray.pop();
      obj.dateTime.pop();
      return obj;
    },
    // 通过value转为数组
    getValue(val) {
      const reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d$/;
      const regExp = new RegExp(reg);
      let arr = val;
      if (regExp.test(val)) {
        arr = [parseInt(val.substring(2, 4)), parseInt(val.substring(5, 7)) - 1, parseInt(val.substring(8, 10)) - 1, parseInt(val.substring(11, 13)), parseInt(val.substring(14))];
      }
      return arr;
    },
  },
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除