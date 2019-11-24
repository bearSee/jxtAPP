
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
    oprateList: [
      {
        type: 'isCollection',
        selected: 'ri-heart-fill',
        select: 'ri-heart-line',
      },
      {
        type: 'isBlacklist',
        selected: 'ri-user-unfollow-fill',
        select: 'ri-user-add-line',
      },
      {
        type: 'isComplaint',
        selected: 'ri-shield-star-fill',
        select: 'ri-shield-star-line',
      },
    ],
  },
  ready: function () {
  },
  methods: {
    clickList({ currentTarget }) {
      const { item } = currentTarget.dataset;
      this.triggerEvent('clickList', item);
    },
    oprate({ currentTarget }) {
      const { item, index, type } = currentTarget.dataset;
      this.triggerEvent('oprate', { item, type, index });
    },
  },
});