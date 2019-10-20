import config from '../../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    getClass: [],
    classplease: '请选择班级',
    time: '请选择时间',
    homeworkId: null,
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function(options) {
    let that = this;
    let Token = wx.getStorageSync('Token');
    wx.request({
      url: config.taskURL + '/grade/getClass',
      data: {},
      header: {
        'Token': Token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        that.setData({
          getClass: res.data.data
        });
      },
    });
  },

  grade: function(e) {
    wx.setStorageSync('getClass', e.currentTarget.dataset.item);
    wx.navigateTo({
      url: '../emotion/emotion',
    });
  }
})