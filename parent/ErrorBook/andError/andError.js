import config from '../../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 错题总数
    questionNum: 0,
    todayError: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const ChildList = wx.getStorageSync('ChildrenItem');
    wx.request({
      url: config.errorURL + '/wrong/getSubject?stuId=' + ChildList.id,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
          console.log(res);
        this.setData({
          todayError: res.data.data
        })
      }
    })
  },

  subject: function(e) {
    let subject = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../seeError/seeError?subjectId=' + subject.subjectId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  }
})