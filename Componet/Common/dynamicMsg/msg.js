import config from "../../../utils/config.js";

Component({

  /**
   * 组件的属性列表
   */

  pageLifetimes: {

    show: function () {

      // this.setData({
      //   my_msgPropArr: [],
      //   num: 1,
      //   touchTottom: false
      // });

      // this.my_msgProp();

    },

    resize: function (size) {}
  },

  properties: {
    // msg: {
    //   type: Array,
    //   value: ''
    // },

    windowHeight: {
      type: Number,
      value: ''
    }

  },

  data: {
    my_msgPropArr: [],
    // windowHeight: null,
    num: 1,
    touchTottom: false,
    headerHide: true,
    nUnReadr: null
  },

  // 监听 my_msgProp 的变化
  observers: {
    // 'my_msgPropArr': function(num) {
    //   this.my_msgPropArr = num;
    // }
  },

  created() {
    this.my_msgProp();
  },

  /**
   * 组件的方法列表
   */
  methods: {

    loadMore() {
      let _this = this;
      let num = this.data.num;
      if (this.data.totalPage == num) {
        _this.setData({
          touchTottom: true
        });
        console.log('到底了');
        return;
      };
      num++;
      this.setData({
        num: num
      });
      this.my_msgProp();
    },

    loadMoreUp() {
      this.setData({
        headerHide: false
      });
      setTimeout(()=> {
        this.setData({
          headerHide: true
        });
      }, 300)
    },

    AllReadClick() {
      let _this = this;
      const Token = wx.getStorageSync('Token');
      wx.request({
        url: config.itemURL + '/message/updateMess',
        header: { Token },
        data: '',
        method: "POST",
        success: (res) => {
          if (res.data.code === 200) {
            let PropArr = _this.data.my_msgPropArr;
            PropArr.map((item, index, arr) => {
              arr[index].stateId = !1;
            });
            _this.setData({
              my_msgPropArr: PropArr
            });
            _this.triggerEvent("nUnRead", 0);
            return;
          }
        },
      })
    },

    my_msgProp() {
      let _this = this;
      const token = wx.getStorageSync('Token');
      wx.request({
        url: config.taskURL + '/message/getMess',
        header: {
          'Token': token
        },
        data: {
          page: this.data.num,
          rows: 10
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code == 200) {
              _this.setData({
                my_msgPropArr: [..._this.data.my_msgPropArr, ...res.data.data.informationPageResult.items],
                totalPage: res.data.data.informationPageResult.totalPage,
                nUnReadr: res.data.data.nUnRead
              });
            _this.triggerEvent("nUnRead", res.data.data.nUnRead);
          }
        }
      })
    },

    AlreadyRead(e) {
      let that = this;
      let item = e.currentTarget.dataset;
      let dataset = item.item;
      if (dataset.stateId != 1) {
        return;
      };
      let id = dataset.id;
      let idx = item.idx;
      const Token = wx.getStorageSync('Token');
      wx.request({
        url: config.itemURL + '/message/updateMess?ids=' + id,
        header: {
          Token
        },
        method: "POST",
        success: (result) => {
          if (result.data.code === 200) {
            let my_msgPropIdx = that.data.my_msgPropArr;
            my_msgPropIdx[idx].stateId = !1;
            that.setData({
              my_msgPropArr: my_msgPropIdx,
              nUnReadr: that.data.nUnReadr - 1
            });
            that.triggerEvent("nUnRead", that.data.nUnReadr);
          };
        }
      })
    }
  }
})