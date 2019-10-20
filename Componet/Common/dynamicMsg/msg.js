import config from "../../../utils/config.js";

let num = 0;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: {
      type: Array,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    my_msgPropArr: [],
  },

  // 监听 my_msgProp 的变化
  observers: {
    'my_msgPropArr': function(num) {
      this.my_msgPropArr = num;
    }
  },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    console.log('触底事件');
  },

  /**
   * 组件的方法列表
   */
  methods: {
    my_msgProp() {
      num++;
      let _this = this;
      const token = wx.getStorageSync('Token');
      wx.request({
        url: config.taskURL + '/test/getMess',
        header: {
          'Token': token
        },
        data: {
          // page: num,
          // rows: 10
        },
        method: 'GET',
        success: function(res) {
          if (res.data.code == 200) {
            
            // _this.setData({
            //   my_msgPropArr: [..._this.data.my_msgPropArr, ...res.data.data.items]
            // });

            _this.setData({
              my_msgPropArr: res.data.data
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