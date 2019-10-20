import util from '../../utils/util.js';
import config from '../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  handleLogin: function(e) {
    var user = e.detail.value;
    // 手机的校验
    var phoneReg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
    // 密码的校验
    var mima = /^(\w){6,12}$/
    if (!user.phone.trim()) {
      util.showTextToast('账号不能为空', 1000);
      return;
    } else if (!user.password.trim()) {
      util.showTextToast('密码不能为空', 1000);
      return;
    } else if (!phoneReg.test(user.phone)) {
      util.showTextToast('手机格式不正确', 1000);
      return;
    } else
    if (!mima.test(user.password)) {
      util.showTextToast('密码格式不正确', 1000);
      return;
    } else {
      // 登录用户名返回Token
      wx.showLoading({
        title: '登录中...'
      });

      util.post(`/user/login?phone=${user.phone}&password=${user.password}`, null, {
          header: {
            'content-type': 'application/json'
          }
        },
        function(res) {
          if (res.data.code == 200) {
            // 保存token
            wx.setStorageSync('Token', res.data.data);

            const Token = wx.getStorageSync('Token');

            // 登录成功
            setTimeout(function() {
              wx.hideLoading();
            }, 2000)

            util.showTextToast('登录成功', 1000, 'success');

            util.getUser('/user/info', null, {
              "Token": Token
            }, function(res) {

              wx.setStorageSync('user', res.data.data);

              if (res.data.data.role == '教师') {
                // 登录成功跳转首页
                const Token = wx.getStorageSync('Token');
                wx.request({
                  url: config.itemURL + '/grade/getClass',
                  data: '',
                  header: {
                    Token: Token
                  },
                  method: 'GET',
                  dataType: 'json',
                  success: function(res) {
                    let resLength = res.data.data.length;
                    if (resLength) {

                      let schoolClass = res.data.data[0];
                      wx.setStorageSync('getClass', res.data.data);
                      wx.setStorageSync('school', schoolClass);
                      //登录成功后将教师的班级保存进本地存储
                      const school = wx.getStorageSync('school');
                      wx.redirectTo({url: "../home/Teacher/teacher"});
                      
                    } else {
                      wx.navigateTo({
                        url: "../../home/homeworkAssignment/bindingSchool/school"
                      })
                    }
                  }
                })
              } else if (res.data.data.role == '家长') {
                wx.request({
                  url: config.itemURL + '/student/getStudent',
                  data: '',
                  header: {
                    Token: Token
                  },
                  method: 'GET',
                  dataType: 'json',
                  success: function(res) {
                    let reslength = res.data.data.length;
                    if (reslength) {
                      wx.redirectTo({ url: "../home/Parent/Parent" });
                    } else {
                      wx.navigateTo({
                        url: "../../home/homeworkAssignment/bindingSchool/school"
                      })
                    }
                  }
                })
              }
            })
          } else if (res.data.code === 4001) {
            util.showTextToast('该账户还没有注册');
          } else {
            wx.hideLoading();
            util.showTextToast('登录失败');
          }
        })
    }
  },

  // 注册页面
  register: function() {
    wx.navigateTo({
      url: '../register/register'
    })
  },

  // 分享
  onShareAppMessage: function() {
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