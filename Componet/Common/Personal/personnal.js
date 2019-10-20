const app = getApp();

import util from '../../../utils/util.js'

Component({

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.userName(); //获取头像昵称等信息
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      console.log('detached');
    },
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function() {
    console.log('attached');
    // 在组件实例进入页面节点树时执行
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
  },
  
  /**
   * 组件的属性列表
   */

  properties: {

  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {
      console.log('show');
    },
    hide: function() {
      console.log('hide');
    },
    resize: function() {
      console.log('resize');
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

    makePhone() {
      wx.makePhoneCall({
        phoneNumber: '18651571984'
      })
    },

    // 获取头像信息
    getUserInfo(e) {
      if (e.detail.errMsg == 'getUserInfo:ok') {
        app.globalData.userInfo = e.detail.userInfo;
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
      } else return;
    },

    userName() {
      if (app.globalData.userInfo) {
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
    },

    cache() {
      util.showTextModal('', '请确认', '', function(res) {
        if (res.confirm) {
          wx.removeStorageSync('Token');
          wx.clearStorageSync();
          try {
            const value = wx.getStorageSync('Token')
            if (!value) {
              wx.redirectTo({
                url: '../../index/index',
              })
            }
          } catch (e) {}
        }
      })
    }
  }
})