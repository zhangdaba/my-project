import config from '../../../utils/config.js'

Page({
  /**
   * 页面的初始数据
   */

  data: {
    task: ['未提交', '未批改', '已批改'],
    currentTabInde: 0,
    checked: false,

    // 假数据
    chapterIndex: 0,

    // 真实数据
    parenTast: [], // 未提交作业

    radioChoice: null, // 选择未提交的作业

    disabled: false
    // 数据格式 end
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.swiperHeight(); //获取屏幕可视高度

    // 数据格式
    this.setData({
      message: '隐藏数据',
    });

    // 数据格式 end
  },

  onShow: function() {
    this.submission(); //获取未提交作业信息
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 获取
    this.setNavigationBarTitle();
  },

  // 动态设置当前导航栏
  setNavigationBarTitle: function () {
    const childList = wx.getStorageSync('ChildrenItem');
    wx.setNavigationBarTitle({
      title: childList.name + ' — 作业'
    })
  },

  switchTab: function (e) {
    this.setData({
      currentTabInde: e.target.dataset.index
    })
  },

  // 获取屏幕高度
  swiperHeight: function () {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          swiperHeight: (res.windowHeight - 34)
        })
      }
    })
  },

  // 滑动
  handleChange: function (e) {
    if (e.detail.source == "touch") {
      this.setData({
        currentTabInde: e.detail.current
      })
    }
  },

  // 获取后台信息
  submission: function () {
    let that = this;
    let token = wx.getStorageSync('Token');
    const childList = wx.getStorageSync('ChildrenItem');
    let parentTast = {
      stuId: childList.id
    };
    wx.request({
      url: config.itemURL + '/submitHomework/list',
      data: parentTast,
      header: {
        Token: token
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) {
          let parenTast = res.data.data;
          let oldparen = [],
              newparen = [],
              already = [];
          for (let k in parenTast) {
            if (parenTast[k].status == 0) {
              oldparen.push(parenTast[k]);
            } else if (parenTast[k].status == 1 || 3) {
              newparen.unshift(parenTast[k]);
            } else if (parenTast[k].status == 2) {
              already.unshift(parenTast[k]);
            }
          }
          oldparen.sort((a,b) =>
            Math.abs(new Date(a.operationEndTime).getTime() - new Date().getTime()) - 
            Math.abs(new Date(b.operationEndTime).getTime() - new Date().getTime()));
          that.setData({
            oldparen: oldparen,
            newparen: newparen,
            already: already,
            parenTast
          })
        } else {
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      },
      
      fail(err) {
        if(err.errMsg == 'request:fail timeout') {
          wx.showToast({
            title: '连接超时，请稍后再试...',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },

  // 单选 多选 全选
  radioChange: function (e) {
    let that = this;
    that.setData({
      radioChoice: e.detail.value
    })
  },

  // 提交作业
  submit: function () {
    let that = this;
    let radioChoice = that.data.radioChoice;
    if (radioChoice === null || radioChoice.length === 0) {
      wx.showToast({
        title: '请先选择需要提交的作业哦',
        icon: 'none',
        duration: 1200
      });
      return;
    }

    wx.showModal({
      title: '提示',
      content: '请确认是否完成所有答题并提交',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.userDetermine(radioChoice, that);
        } else if (res.cancel) {
          console.log('用户点击取消')
          return;
        }
      },
      fail(err) {
        if(err.errMsg == 'request:fail timeout') {
          wx.showToast({
            title: '连接超时，请稍后再试...',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  
  userDetermine(radioChoice, that) {
    // 把数组中的每一项转换为数字,传递给后台
    that.setData({
      disabled: true
    });

    var newradioChoice = [];
    for (let k in radioChoice) {
      let numRadio = Number(radioChoice[k]);
      newradioChoice.push(numRadio)
    }

    let submit = {
      submitHomework_id: newradioChoice //作业id
    }

    wx.request({
      url: config.itemURL + '/submitHomework/submitHomework',
      data: submit,
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            disabled: true
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 800
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 800)
        }
      }
    });

  },

  // 查看作业
  See_work: function (e) {
    let item = e.currentTarget.dataset.item;
    let homeworkId = item.homeworkId;
    wx.navigateTo({
      url: '../subSee/subSee?id=3&homeworkId='+homeworkId
    });
  },

  viewUncorrected(e) {
    let item = e.currentTarget.dataset.item;
    let homeworkId = item.homeworkId;
    wx.navigateTo({
      url: '../subSee/subSee?id=1&homeworkId='+homeworkId
    });
  },

  Submitte(e) {
    let item = e.currentTarget.dataset.item;
    let homeworkId = item.homeworkId;
    wx.navigateTo({
      url: '../subSee/subSee?id=2&homeworkId='+homeworkId
    });
  },

})