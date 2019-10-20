import config from '../../../utils/config.js';

Page({
  /* 页面的初始数据
   */
  data: {
    task: ['未批改','已批改'],
    currentTabInde: 0,
    GradeClass: ['一年级','二年级','三年级'],
    screenWidth: 0,  // 屏幕高度
    oldRes: [],
    newRes:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.screenWidth();
    // 教师批改作业
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.teacher();
  },
  
  // 事件委托
  switchTab: function (e) {
    let _this = this;
    _this.setData({
      currentTabInde: e.target.dataset.index
    })
  },

  // 屏幕可用高度(显示内容)
  screenWidth: function () {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          screenWidth: (res.windowHeight)
        })
      }
    })
  },

  currentTab: function (e) {
    let _this = this;
    if (e.detail.source == 'touch') {
      _this.setData({
        currentTabInde: e.detail.current
      })
    }
  },

  // 批改作业
  correcting: function(e) {
    let correcting = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../Correcting/Correcting?correcting=' + correcting,
      success: function(res) {}
    })
  },

  // 老师批改作业
  teacher: function() {
    let _this = this;
    const token = wx.getStorageSync("Token");
    
    wx.request({
      url: config.itemURL + '/homework/get_homework',
      data: '',
      header: { "Token": token },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {;
        if(res.data.code === 200) {
          let resArr = res.data.data.items;
          let oldRes = [];
          let newRes = [];
          for(let k in resArr) {
            if(resArr[k].status == 1) {
              oldRes.push(resArr[k]);
            } else if(resArr[k].status == 0) {
              newRes.push(resArr[k]);
            }
          }
          _this.setData({
            oldRes,
            newRes
          })
        } else {
          wx.showToast({
            title: '身份过期，重新登录',
            icon: 'none',
            duration: 2000
          })
          setTimeout(()=> {
          wx.reLaunch({
            url: '/pages/index/index'
          });
          }, 2000)
        }
      }
    })
  },

  // 未批改
  notCorrected: function(e) {

    let notCorrected = e.currentTarget.dataset.task;
    
    wx.setStorageSync('notCorrected', notCorrected);

    let notCorrecteds = wx.getStorageSync('notCorrected');
    
    wx.navigateTo({
      url: '../divide/divide',
      success: function(res) {}
    })
  },

  stuDent: function(e) {
    let notCorrected = e.currentTarget.dataset.task;
    wx.setStorageSync('notCorrected', notCorrected);
    wx.navigateTo({
      url: '../Student/Student',
    })
  }
})