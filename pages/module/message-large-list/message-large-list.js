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
    edit: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    x: 0,
    itemindex: 0,
    oprateList: [
      {
        type: 'isCollection',
        selected: 'ri-heart-fill',
        select: 'ri-heart-line',
      },
      {
        type: 'isBlacklist',
        selected: 'ri-user-unfollow-fill',
        select: 'ri-user-unfollow-line',
        // select: 'ri-user-add-line',
      },
      {
        type: 'isComplaint',
        selected: 'ri-shield-star-fill',
        select: 'ri-shield-star-line',
      },
    ],
    editList: [
      {
        type: 'edit',
        name: '编辑',
        selected: 'ri-edit-line',
        select: 'ri-edit-line',
      },
      {
        type: 'delete',
        name: '删除',
        selected: 'ri-delete-bin-5-line',
        select: 'ri-delete-bin-5-line',
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