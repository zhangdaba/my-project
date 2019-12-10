import config from "../../../utils/config.js";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: Array,
      value: ''
    },

    windowHeight: {
      type: Number,
      value: ''
    }

  },

  // lifetimes: {
    attached:function() {
      console.log('>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<');
    },
  // },

  /**
   * 组件的初始数据
   */
  data: {
    my_msgPropArr: [],
    // windowHeight: null,
    num: 1,
    touchTottom: false
  },

  // 监听 my_msgProp 的变化
  observers: {
    // 'my_msgPropArr': function(num) {
    //   this.my_msgPropArr = num;
    // }
  },

  created() {
    // this.windowHeight();
    this.my_msgProp();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // windowHeight: function() {
    //   let _this = this;
    //   wx.getSystemInfo({
    //     success(res) {
    //       _this.setData({
    //         windowHeight: res.windowHeight
    //       });
    //     }
    //   })
    // },

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

    my_msgProp() {
      let _this = this;
      const token = wx.getStorageSync('Token');
      wx.request({
        url: config.taskURL + '/test/getMess',
        header: {
          'Token': token
        },
        data: {
          page: this.data.num,
          rows: 10
        },
        method: 'GET',
        success: function(res) {
          if (res.data.code == 200) {
            _this.setData({
              my_msgPropArr: [..._this.data.my_msgPropArr, ...res.data.data.items],
              totalPage: res.data.data.totalPage
            });

            setTimeout(function() {
              wx.hideLoading();
            }, 800);

          }
        }
      })
    }
  }

})