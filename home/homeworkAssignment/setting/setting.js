import config from '../../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    setting: [],
    settingName: {},
    chapItemContent: '',
    isTrue: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let chapItemContent = wx.getStorageSync('chapItem');

    this.setData({
      chapItemContent: chapItemContent
    })

    const Token = wx.getStorageSync('Token');
    const getClass = wx.getStorageSync('Selection');

    wx.request({
      url: config.itemURL + '/queTactic/list?classId=' + getClass.id,
      data: '',
      header: {
        Token: Token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        console.log(res);
        if(res.data.code == 200) {
          this.setData({
            setting: res.data.data.reverse()
          })
        } else {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    })
  },

  settinGlong(e) {
    this.setData({
      settingName :e.target.dataset.item,
      isTrue: true
    })
  },

  settingClick(e) {

    if(e.type !== 'tap') {
      return;
    }

    let ev = e.target.dataset;
    
    ev.item.difficult = ev.item.difficult / 100;

    delete ev.item.errorQueCount;

    this.setData({
      idx: ev.idx,
      items: ev.item
    })
    
    wx.setStorageSync('setting', ev.item);

    wx.navigateTo({
      url: '../sidebar/sidebar',
    })
  }
})