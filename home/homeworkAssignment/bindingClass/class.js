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

  submit: function(e) {
    let _this = this;
    let userInfo = e.detail.value;
    let className = _this.data.name;

    if (className == null) {
      wx.showToast({
        title: '请输入您要选择的班级',
        icon: 'none',
        duration: 1500
      })
      return;
    } else if (userInfo.name == "" || userInfo.curriculum == "" ) {
      wx.showToast({
        title: '请输入您的真实姓名与所教课程',
        icon: 'none',
        duration: 1500
      })
      return;
    }

    const token = wx.getStorageSync('Token');

    wx.request({
      url: config.itemURL + '/teacher/binding?classId=' + className.id + '&name=' + userInfo.name + '&subject=' +   userInfo.curriculum,
      data: '',
      header: { Token: token },
      method: 'POST',
      responseType: 'text',
      success: function(res) {
        if (res.data.message == 'SUCCESS') {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 800
          });
          setTimeout(function() {
            wx.request({
              url: config.itemURL + '/grade/getClass',
              data: '',
              header: {
                'Token': token
              },
              method: 'GET',
              dataType: 'json',
              success: function (res) {
                let resLength = res.data.data;
                if (resLength) {
                  let schoolClass = res.data.data;
                  wx.setStorageSync('school', schoolClass);
                  const school = wx.getStorageSync('school');
                  wx.switchTab({
                    url: '../../../pages/home/home'
                  });
                } else {
                  wx.showToast({
                    title: '没有所教课程',
                    icon: 'none',
                    duration: 800
                  })
                }
              }
            })
          }, 300)
        } else {
          wx.showToast({
            title: '此班级没有该老师信息',
            icon: 'none',
            duration: 800
          });
        }
      },
      fail: function(res) {
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  }
})