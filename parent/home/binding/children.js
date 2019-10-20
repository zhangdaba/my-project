import config from '../../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const school = wx.getStorageSync('school');
    const className = wx.getStorageSync('className');
    const user = wx.getStorageSync('user');
    this.setData({
      className
    })
  },

  //身份选择
  goIndex: function (e) {
    let _this = this;
    let index = e.currentTarget.dataset.index + 1;
    let name = e.currentTarget.dataset.item;

    _this.setData({
      idx: index,
      name: name
    })
  },

  submit: function (e) {
    let _this = this;
    let userInfo = e.detail.value;
    let className = _this.data.name;

    if (className == null) {
      wx.showToast({
        title: '请输入您要选择的班级',
        icon: 'none',
        duration: 1500
      });
      return;
    } else if (userInfo.name == "" || userInfo.curriculum == "") {
      wx.showToast({
        title: '真实姓名与学生学号不能为空',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    const token = wx.getStorageSync('Token');

    wx.request({
      url: config.itemURL + '/student/binding?classId=' + className.id + '&name=' + userInfo.name + '&stuno=' + userInfo.curriculum,
      data: '',
      header: { Token: token },
      method: 'POST',
      responseType: 'text',
      success: function (res) {
        if (res.data.message == 'SUCCESS') {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 800
          })
          setTimeout(function () {
            wx.request({
              url: config.itemURL + '/grade/getClass',
              data: '',
              header: {
                'Token': token
              },
              method: 'GET',
              dataType: 'json',
              success: function (res) {
                const school = wx.getStorageSync('school');
                wx.switchTab({
                  url: '../../../pages/home/home'
                });
              }
            })
          }, 800)
        } else {
          wx.showToast({
            title: '没找到班级数据',
            icon: 'none',
            duration: 800
          })
        }
      },
      fail: function (res) {
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})