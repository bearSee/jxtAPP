const app = getApp();
// 基础库 2.7.0 开始支持，低版本需做兼容处理。https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.getContents.html
var timer;
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    // 初始数据html字符串
    html: {
      type: String,
      value: '',
    },
    // 初始数据对象
    delta: {
      type: Object,
      value: () => ({}),
    },
    // 只读
    readOnly: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String,
      value: '开始输入...',
    },
    // 点击图片时显示图片大小控件	
    showImgSize: {
      type: Boolean,
      value: false,
    },
    // 点击图片时显示工具栏控件	
    showImgToolbar: {
      type: Boolean,
      value: false,
    },
    // 点击图片时显示修改尺寸控件	
    showImgResize: {
      type: Boolean,
      value: true,
    },
    // 图片附带属性
    // src	图片地址，仅支持 http(s)、base64、云图片(2.8.0)、临时文件(2.8.3)。
    // alt	图像无法显示时的替代文本
    // width	图片宽度（pixels/百分比)
    // height	图片高度 (pixels/百分比)
    // extClass	添加到图片 img 标签上的类名
    // data	Object	data被序列化为 name=value;name1=value2 的格式挂在属性 data-custom 上
    imageAttr: {
      type: Object,
      value: () => ({}),
    },
  },
  data: {
    // 已设置的样式
    formats: {},
    editorHeight: 0,
    keyboardHeight: 0,
    isIOS: false,
  },
  ready() {
    this.setData({ isIOS: wx.getSystemInfoSync().platform === 'ios' });
    this.updatePosition(0);
    // 监听键盘高度变化
    wx.onKeyboardHeightChange(({ height, duration }) => {
      this.updatePosition(height);
      wx.pageScrollTo({
        scrollTop: 0,
        complete: () => {
          this.scrollIntoView();
        },
      });
    });
  },
  methods: {
    /**
     * 页面方法
     */
    updatePosition(keyboardHeight) {
      if (keyboardHeight === this.data.keyboardHeight && keyboardHeight !== 0) return;
      const toolbarHeight = 50;
      const { windowHeight } = wx.getSystemInfoSync();
      const editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight;
      this.setData({ editorHeight, keyboardHeight });
    },
    // 修改当前样式
    handlerFormat({ target }) {
      const { name, value } = target.dataset;
      this.format(name, value);
    },
    // 添加日期
    handlerInsertDate() {
      const date = new Date();
      const text = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      this.insertText(text);
    },
    // 添加图片
    handlerInsertImage() {
      wx.chooseImage({
        count: 1,
        success: ({ tempFilePaths }) => {
          this.getPicUrl(tempFilePaths[0]).then(
            (imgUrl) => {
              this.insertImage(imgUrl);
            },
          );
        },
      })
    },
    /**
     * <editor></editor>
     * 标签API
     */
    // 富文本Ready阶段bindready
    onEditorReady() {
      this.createSelectorQuery().select('#editor').context(({ context }) => {
        this.editorCtx = context;
        this.setContents();
      }).exec();
    },
    // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
    onStatusChange({ detail: formats }) {
      this.setData({ formats });
    },
    // 编辑器聚焦时触发，event.detail = {html, text, delta}
    onFocus({ detail }) {
      this.triggerEvent('focus', detail);
    },
    // 编辑器失去焦点时触发，detail = {html, text, delta}
    onBlur({ detail }) {
      this.triggerEvent('blur', detail);
    },
    // 编辑器内容改变时触发，detail = {html, text, delta}
    onInput({ detail }) {
      this.triggerEvent('input', detail);
    },

    /**
     * EditorContext实例API
     */
    // 初始化编辑器内容，html(带标签的HTML内容)和delta(表示内容的delta对象)同时存在时仅delta生效
    setContents(obj) {
      const { html, delta } = obj || this.properties;
      if (html) {
        this.editorCtx.setContents({ html });
      } else if (delta && Object.keys(delta).length) {
        this.editorCtx.setContents({ delta });
      }
    },
    // 获取编辑器内容
    getContents() {
      this.editorCtx.getContents({
        success: (res) => {
          this.triggerEvent('getContents', res);
        },
      });
    },
    // 获取编辑器已选区域内的纯文本内容。当编辑器失焦或未选中一段区间时，返回内容为空。
    getSelectionText() {
      this.editorCtx.getSelectionText({
        success: (res) => {
          this.triggerEvent('getSelectionText', res);
        },
      });
    },
    // 恢复
    redo() {
      this.editorCtx.redo();
    },
    // 撤销
    undo() {
      this.editorCtx.undo();
    },
    // 插入分割线
    insertDivider() {
      this.editorCtx.insertDivider();
    },
    // 使编辑器失焦，同时收起键盘。
    handleBlur() {
      this.editorCtx.blur();
    },
    // 清空编辑器内容
    clear() {
      this.editorCtx.clear({
        success: () => {
          this.triggerEvent('handleClear');
        },
      });
    },
    // 修改样式
    format(name, value) {
      console.log(name, value, name && value)
      if (name) this.editorCtx.format(name, value);
    },
    // 清除当前选区的样式
    removeFormat() {
      this.editorCtx.removeFormat();
    },
    // 覆盖当前选区，设置一段文本
    insertText(text) {
      this.editorCtx.insertText({
        text,
        success: () => {
          this.triggerEvent('handleInsertText', text);
        },
      });
    },
    // 添加图片
    insertImage(src) {
      this.editorCtx.insertImage({
        src,
        ...this.properties.imageAttr,
        complete: () => {
          this.triggerEvent('insertImage', src);
        },
      });
    },
    // 使得编辑器光标处滚动到窗口可视区域内
    scrollIntoView() {
      this.editorCtx.scrollIntoView();
    },
    // 将图片传给后台识别返回url
    getPicUrl(filePath) {
      wx.showLoading({ title: '加载中...', mask: true });
      return new Promise((resolve, reject) => {
        const { host } = app.globalData;
        const url = `${host}file/upload`
        const header = {
          Authorization: wx.getStorageSync('Authorization') || '',
        };
        wx.uploadFile({
          url,
          filePath,
          header,
          name: 'file',
          success: ({ data }) => {
            data = data && JSON.parse(data) || {};
            console.log(data);
            resolve(data.fileName || '');
          },
          fail: () => {
            reject();
          },
          complete: () => {
            wx.hideLoading();
          },
        });
      });
    },
  },
})
