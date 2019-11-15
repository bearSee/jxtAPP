import formatTime from '../../utils/dateUtil.js';
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'date',
    },
    value: {
      type: String,
      value: '',
    },
    fields: {
      type: String,
      value: 'day',
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
  data: {},

  ready: function () {
    if (!this.properties.value) {
      const date = new Date();
      let value = '';
      if (this.properties.type === 'date') {
        const index = ['year', 'month', 'day'].indexOf(this.properties.fields);
        // value = formatTime(date).split('-').slice(0, index + 1).join('-');
      }
      this.triggerEvent('input', { value });
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handlerDateChange(e) {
      const value = e.detail.value;
      this.triggerEvent('input', { value });
    },
  },
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除