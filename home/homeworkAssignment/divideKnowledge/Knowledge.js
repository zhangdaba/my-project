import config from '../../../utils/config.js'
let chapters = [{
  id: 1,
  content: '第三章的内容 构造函数，闭包，递归，继承',
  server: '七年级上册'
}]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    chapters
  },

  chapter: function(e) {
    console.log('内容',e);
    let chapId = e.currentTarget.dataset.chap;
    wx.setStorageSync('chapItem', chapId);
    wx.navigateTo({
      url: '../divNumber/number',
      success: function(res) {}
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let bookStorage = wx.getStorageSync('book');
    wx.request({
      url: config.listURL + '/message/getKnowledgeByName',
      data: { editionName: bookStorage.edition, gradeName: bookStorage.book, subjectName: bookStorage.subject },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log('内容', res.data.data);
        _this.setData({
          chapterInfo: res.data.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})