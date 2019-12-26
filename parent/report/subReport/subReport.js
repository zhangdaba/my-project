import config from '../../../utils/config.js';

Page({

  data: {
    colorId: null,
    subject: [],
    select: false,
    times: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const ChildList = wx.getStorageSync('ChildrenItem');
    wx.request({
      url: config.basisURL + '/student/selectSubject?stuId='+ChildList.id,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        this.setData({
          subject: res.data.data
        })
      }
    })
  },
  // 学科
  subject: function(e) {
    let _this = this;
    let idx = e.currentTarget.dataset.idx;
    let kemuId = e.currentTarget.dataset.item.subjectId;
    wx.navigateTo({
      url: '../Learning/learning?kemuId=' + kemuId,
      success: function(res) {}
    })

    _this.setData({
      colorId: idx
    });
  }

})