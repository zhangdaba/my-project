import config from '../../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errors: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.error();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  // 老师获取班级错误信息
  error: function() {
    let _this = this;
    const token = wx.getStorageSync('Token');
    wx.request({
      url: config.basisURL + '/teacher/getTeacher',
      data: '',
      header: {
        'Token': token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        if (res.data.code == 200) {
          _this.setData({
            errors: res.data.data
          })
        } else {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    })
  },

  // 家长端
  task_error: function(e) {
    let task_errorId = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: '../errorItem/errorItem?task_error=' + task_errorId,
    })
  }
})