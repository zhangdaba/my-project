import config from '../../../utils/config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notRes: [],
    readyRes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.kemu();
  },

  // 获取题型列表
  kemu: function () {
    let _this = this;
    let notCorrecteds = wx.getStorageSync('notCorrected');

    wx.request({
      url: config.taskURL + '/correction/get_ques',
      data: { HomeworkId: notCorrecteds.homeworkId },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        let resAnd = res.data.data;
        let notRes = [], readyRes = [];
        for (let q in resAnd) {
          if (resAnd[q].questionStatus == 0) {
            notRes.push(resAnd[q]);
          } else if (resAnd[q].questionStatus == 1) {
            readyRes.push(resAnd[q]);
          }
        }
        _this.setData({
          notRes,
          readyRes
        })
      }
    })
  },

  //点击题目
  Corrected(e) {
    let title = e.currentTarget.dataset.item.queNo;
    wx.request({
      url: config.taskURL + '/correction/getQueByNo',
      data: { homeworkId: e.currentTarget.dataset.item.homeworkId, queNo: title, 'wx':'wx' },
      header: {},
      method: 'GET',
      success: function(res) {
        if(res.data.code == 200) {
          wx.setStorageSync('notCorrectedss',res.data.data);
          setTimeout(function() {
            wx.navigateTo({
              url: `../Correcting/Correcting?title=第${title}题`
            })
          },300)
        } 
      }
    })
  }

})
