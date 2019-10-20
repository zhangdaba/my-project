import config from '../../../utils/config.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    msg: '',
    msgArr: [],
    books: []
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    this.schoolName(); //年级
  },

  // 跳转到布置作业页面
  taskone: function(e) {
    let book = e.currentTarget.dataset.item;
    wx.setStorageSync('Selection', book);
    wx.navigateTo({
      url: '../dividehapter/chapter',
    });
  },
  
  // 年级
  schoolName: function() {
    let _this = this;
    const Token = wx.getStorageSync('Token');
    wx.request({
      url: config.itemURL + '/grade/getClass',
      data: '',
      header: {'Token': Token },
      method: 'GET',
      success: function(res) {
        let resData = res.data.data;
        _this.setData({
          books: resData.reverse()
        })
      }
    })
  }
  
})