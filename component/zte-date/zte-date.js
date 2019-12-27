// type: year,month,day,time
const getNowTime = (type) => {
  const date = new Date();
  const clear = d => (d > 9 ? d : `0${d}`);
  let value = '';
  if (type === 'year') value = `${date.getFullYear()}`;
  if (type === 'month') value = `${date.getFullYear()}-${clear(date.getMonth() + 1)}`;
  if (type === 'day') value = `${date.getFullYear()}-${clear(date.getMonth() + 1)}-${clear(date.getDate())}`;
  if (type === 'time') value = `${clear(date.getHours())}:${clear(date.getMinutes())}`;
  return value;
};
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
    // fields：有效值 year,month,day，表示选择器的粒度
    fields: {
      type: String,
      value: 'day',
    },
    // start： fields为day时，表示有效时间范围的开始，字符串格式为"hh:mm"
    // start： fields为date时，表示有效日期范围的开始，字符串格式为"YYYY-MM-DD"
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
  },

  ready: function () {
    // this.getCreatedData();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getCreatedData() {
      const { value, type, fields } = this.properties;
      if (!value) {
        let currentTime;
        if (type === 'date') {
          currentTime = getNowTime(fields);
        } else {
          currentTime = getNowTime('time');
        }
        this.triggerEvent('input', { value: currentTime });
      }
    },
    handlerDateChange({ detail }) {
      const value = detail.value;
      this.triggerEvent('input', { value });
    },
  },
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除