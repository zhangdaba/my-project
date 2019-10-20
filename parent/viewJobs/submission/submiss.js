import config from '../../../utils/config.js'

Page({
  /**
   * 页面的初始数据
   */

  data: {
    task: ['未提交','已提交','已批改'],
    currentTabInde: 0,
    checked: false,

    // 假数据
    chapterIndex: 0,

    // 真实数据
    parenTast: [], // 未提交作业

    radioChoice:null, // 选择未提交的作业

    disabled: false
    // 数据格式 end
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.swiperHeight(); //获取屏幕可视高度

    this.submission(); //获取未提交作业信息

    // 数据格式
    this.setData({
      message: '隐藏数据',
    });

    // 数据格式 end
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 获取
    this.setNavigationBarTitle();
  },
  
  // 动态设置当前导航栏
  setNavigationBarTitle: function() {
    const childList = wx.getStorageSync('ChildrenItem');
    wx.setNavigationBarTitle({
      title: childList.name + ' — 作业'
    })
  },

  switchTab: function(e) {
    let _this = this;
    this.setData({
      currentTabInde: e.target.dataset.index
    })
  },

  // 获取屏幕高度
  swiperHeight: function() {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          swiperHeight: (res.windowHeight - 34)
        })
      }
    })
  },

  // 滑动
  handleChange: function(e) {
    let _this = this;
    if (e.detail.source == "touch") {
      this.setData({
        currentTabInde: e.detail.current
      })
    }
  },

  // 获取后台信息
  submission: function() {

    let _this = this;
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
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        let parenTast = res.data.data;
        let oldparen = [], newparen = [], already = [];

        for (let k in parenTast) {
          if (parenTast[k].status == 0) {
            oldparen.push(parenTast[k]);
          } else if (parenTast[k].status == 1) {
            newparen.push(parenTast[k]);
          } else if (parenTast[k].status == 2) {
            already.push(parenTast[k]);
          }
        }

        _this.setData({
          oldparen: oldparen.reverse(),
          newparen: newparen.reverse(),
          already: already.reverse(),
          parenTast
        })

      }
    })
  },

  // 单选 多选 全选
  radioChange: function(e) {
    let _this = this;
    console.log(e);
    _this.setData({
      radioChoice: e.detail.value
    })
  },

  // 提交作业
  submit: function() {
    let _this = this;
    let radioChoice = _this.data.radioChoice;

    if (radioChoice === null || radioChoice.length === 0 ) {
      wx.showToast({
        title: '暂无提交信息',
        icon: 'none',
        duration: 1200
      })
      return;
    }

    // 把数组中的每一项转换为数字,传递给后台

    _this.setData({
      disabled: true
    })

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
      success: function(res) {
        
        if (res.data.code == 200) {
          _this.setData({
            disabled: true
          })
          
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 800
          })

          setTimeout(function() {

            wx.navigateBack({
              delta: 1
            })

          }, 800)
        }
      }
    })

  },

  // 查看作业
  See_work: function (e) {
    console.log(e);
    let submitHomeworkId = e.currentTarget.dataset.item.submitHomeworkId;
    wx.request({
      url: config.itemURL + '/correction/get_que',
      data: { submitHomeworkId: submitHomeworkId, wx: 'wx' },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if( res.data.code == 200 ) {
          wx.setStorageSync('subSee', res.data.data);
          setTimeout(function() {
            wx.navigateTo({
              url: '../subSee/subSee'
            });
          }, 500)
        }
      }
    })

  }

})