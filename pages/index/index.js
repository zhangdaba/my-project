import util from '../../utils/util.js';
import config from '../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadinGdis: false,
    // 手机号
    CellPhoneInput: '',
    CellPasswordInput: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.versionUpdating()
  },

  versionUpdating() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if(res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      console.log('新版本下载失败')
    })
  },

  handleLogin: function (e) {
    let _this = this;
    var user = e.detail.value;
    var num = /^1(3|4|5|7|8)\d{9}$/;
    if (!num.test(user.phone)) {
      util.showTextToast('手机号错误，请重新核对！', 1000);
      return;
    };

    _this.setData({
      loadinGdis: true
    });

    wx.request({
      url: `${ config.baseURL }/user/login`,
      data: {
        phone: user.phone,
        password: user.password
      },
      method: "POST",
      success: (res) => {
        if (res.data.code == 200) {
          // 保存token
          wx.setStorageSync('Token', res.data.data);
          const Token = wx.getStorageSync('Token');
          /**
           * 请求token成功, 判断用户身份
           */
          this.loginSuccessfully(Token);
        } else if (res.data.code === 4001) {
          util.showTextToast('账号或密码错误');
          _this.setData({
            loadinGdis: false
          })
        } else {
          util.showTextToast('登录失败,请稍后再试...');
          _this.setData({
            loadinGdis: false
          })
        }
      },
      fail(err) {
        if (err.errMsg == 'request:fail timeout' || 'request:fail') {
          util.showTextToast('连接超时，请稍后再试...');
          _this.setData({
            loadinGdis: false,
            CellPhoneInput: '',
            CellPasswordInput: ''
          })
        }
      }
    });
  },

  // 判断身份
  loginSuccessfully(Token) {
    let that = this;
    util.getUser('/user/info', null, {
      "Token": Token
    }, function (res) {
      wx.setStorageSync('user', res.data.data);
      if (res.data.data.role == '教师') {
        wx.showToast({
          title: '该账号是教师账号，不能在家长端登录',
          icon: 'none',
          duration: 1000
        });
        that.setData({
          loadinGdis: false
        })
        return;
        that.Teacher(Token);
      } else if (res.data.data.role == '家长') {
        util.showTextToast('登录成功', 1000, 'success');
        that.Parent(Token);
      }
      setTimeout(() => {
        that.setData({
          loadinGdis: false
        });
      }, 800);
    })
  },

  CellPhone(e) {
    this.setData({
      CellPhoneInput: e.detail.value
    });
  },

  clearPhone() {
    this.setData({
      CellPhoneInput: ''
    });
  },

  CellPassword(e) {
    this.setData({
      CellPasswordInput: e.detail.value
    });
  },

  clearPassword() {
    this.setData({
      CellPasswordInput: ''
    });
  },

  Teacher(Token) {
    // 登录成功跳转首页
    wx.request({
      url: config.basisURL + '/teacher/getTeacher',
      data: '',
      header: {
        Token: Token
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        let resLen = res.data.data.length;
        if (resLen) {
          // 登录成功后将教师的班级保存进本地存储
          wx.setStorageSync('getClass', res.data.data);
          wx.redirectTo({
            url: "../home/Teacher/teacher"
          });
        } else {
          wx.navigateTo({
            url: "../../home/homeworkAssignment/bindingSchool/school"
          })
        }
      }
    })
  },

  Parent(Token) {
    wx.request({
      url: config.basisURL + '/student/getStudent',
      data: '',
      header: {
        Token: Token
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        let reslen = res.data.data.length;
        if (reslen) {
          wx.redirectTo({
            url: "../home/Parent/Parent"
          });
        } else {
          wx.navigateTo({
            url: "../../home/homeworkAssignment/bindingSchool/school"
          })
        }
      }
    })
  },

  // 注册页面
  forget: function () {
    wx.navigateTo({
      url: '../forget/forget'
    })
  },

  // 分享
  onShareAppMessage: function () {
    return {
      title: '智能笔小程序',
      desc: '智能笔',
      path: '/pages/index/index',
      imageUrl: "../../static/images/04.png",
      success: (res) => {
        console.log("转发成功", JSON.stringify(res));
      },
      fail: (res) => {
        console.log("转发失败", JSON.stringify(res));
      }
    }
  }
})