
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    codeList: {
      type: Array,
      value: [], // ['省code', '市code', ''区code]
    },
    value: {
      type: Object,
      value: {}, // { 省: '', 市: '' 区: '' }
    },
    disabled: {
      type: Boolean,
      value: false,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    listData: [],
  },
  
  ready: function () {
    this.initFormItem();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化数据
    initFormItem() {
      const data = this.properties.value;
      const list = this.properties.codeList;
      const listData = data ? [data[list[0]], data[list[1]], data[list[2]]] : [];

      this.setData({
        listData,
        list,
      });
    },

    // 地区选择
    regionChange: function (e) {
      const list = e.currentTarget.dataset.list;
      const placeInfo = e.detail;
      const listData = placeInfo.value;
      this.setData({ listData });

      this.triggerEvent('input', { placeInfo, value: listData });
    },
  }
})
// created 组件实例化，但节点树还未导入，因此这时不能用setData

// attached 节点树完成，可以用setData渲染节点，但无法操作节点

// ready(不是onReady) 组件布局完成，这时可以获取节点信息，也可以操作节点

// moved 组件实例被移动到树的另一个位置

// detached 组件实例从节点树中移除