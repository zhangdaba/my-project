import config from '../../../utils/config.js'

let divides = [{ id: 1, title: '按学生批改', icon: 'icon-icon-pencil' }, {id: 2, title: '按题目批改',icon: 'icon-zhishidian' }]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    divides,
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  
  divide: function (e) {
    let ev = e.currentTarget.dataset.divde.id;
    if (ev === 1) {
      wx.navigateTo({
        url: '../Student/Student'
      })
      
    }else if (ev === 2) {
      wx.navigateTo({
        url: '../Question/question',
        success: function (res) {
        }
      })
    }
  }
})