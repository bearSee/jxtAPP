
const app = getApp();

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    list: {
      type: Array,
      value: [],
    },
  },
  data: {
  },
  ready: function () {
    console.log(this.properties.list)
  },
  methods: {
    clickView({ currentTarget }) {
      const { item } = currentTarget.dataset;
      this.triggerEvent('clickView', item);
    },
  },
});