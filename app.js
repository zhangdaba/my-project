// import util from './utils/util.js';
function log(msg, msg1, msg2) {
  console.log(msg, msg1 ,msg2);
};

App({
  onLaunch: function () {

    wx.getNetworkType({
      success (res) {
        if(res.networkType == 'none') {
          wx.showToast({
            title: '请打开网络',
            icon: 'none',
            duration: 2000
          });
          return;
        } else {
          wx.showToast({
            title: `当前网络来源${res.networkType}`,
            icon: 'none',
            duration: 2000
          });
          return;
        };
      }
    });

    wx.onNetworkStatusChange(function(res) {
      if(!res.isConnected) {
        // 无网络
        wx.showToast({
          title: '请打开网络',
          icon: 'none',
          duration: 2000
        });
        return;
      } else {
        // res.networkType
        wx.showToast({
          title: `当前网络来源${res.networkType}`,
          icon: 'none',
          duration: 2000
        });
        return;
      };
    });

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
  },

  onShow: function () {
    log('onShow');
  },

  onHide: function() {
    log('onHide');
  },

  onPageNotFound: function() {
    log('onPageNotFound');
  },

  globalData: {
    userInfo: null
  }

});