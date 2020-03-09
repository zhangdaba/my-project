import config from '../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeCellPhoneInput: '',
    GetVerificationText: '',
    CodeTime: 60,
    disabledCode: false,
    isHidden: 0,
    password: '',
    confirmPassword: ''
  },

  CellPhone(e) {
    this.setData({
      codeCellPhoneInput: e.detail.value
    });
  },

  GetVerification() {
    let phone = this.data.codeCellPhoneInput;
    if(phone === '') {
      return;
    };

    wx.request({
      url: config.baseURL + '/user/checkPhone',
      data: {
        phone
      },
      method: 'GET',
      success: (result) => {
        const code = result.data.code;
        switch (code) {
          case 4001:
            wx.showToast({
              title: '手机号格式错误',
              icon: 'none',
              duration: 1000
            });
            break
          case 4004:
            wx.showToast({
              title: '该账号没有注册',
              icon: 'none',
              duration: 1000
            });
            break
          case 200:
            this.GetVerificationCode(phone);
            this.timeDisabledCode();
            break
          default:
            wx.showToast({
              title: '获取验证码失败',
              icon: 'none',
              duration: 1000
            });
            break
        }
      },
    })
  },

  GetVerificationCode(phone) {
    console.log('手机号验证成功');
    let that = this;
    wx.request({
      url: config.baseURL + '/user/code?phone=' + phone,
      method: 'POST',
      success: (result) => {
        const code = result.data.code;
        if (code === 200) {
          console.log('获取验证码成功')
        } else {
          console.log('获取验证码失败')
        }
      },
    })
  },

  timeDisabledCode() {
    this.setData({
      disabledCode: true
    });

    setTimeout(() => {
      this.setData({
        disabledCode: false
      });
    }, 60000);

    // let time = setInterval(() => {
    //   this.setData({
    //     CodeTime: this.data.CodeTime--,
    //     disabledCode: true
    //   })
    //   if (this.data.CodeTime >= 60) {
    //     clearInterval(time);
    //     this.setData({
    //       CodeTime: 60,
    //       disabledCode: false
    //     })
    //   }
    // }, 1000);
  },

  CellPhoneText(e) {
    this.setData({
      GetVerificationText: e.detail.value
    });
  },

  isDisabledCode() {
    let that = this;
    wx.request({
      url: config.baseURL + '/user/checkCode',
      data: {
        phone: this.data.codeCellPhoneInput,
        code: this.data.GetVerificationText
      },
      method: "GET",
      success: (result) => {
        const code = result.data.code;
        if (code === 200) {
          console.log(result.data.data, "130");
          if (!result.data.data) {
            wx.showToast({
              title: '验证码错误, 请确定后重新输入',
              icon: 'none',
              duration: 1000
            });
          } else {
            console.log("验证码正确");
            that.SetNewPassword();
          }
        }
      },
    })
  },

  SetNewPassword() {
    this.setData({
      isHidden: !this.data.isHidden
    })
  },

  CellPassword(e) {
    this.setData({
      password: e.detail.value
    });
  },

  ConfirmCellPassword(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  ispwdCode() {
    let is = this.data;
    console.log(is.confirmPassword, is.password);
    if (is.confirmPassword !== is.password) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 1000
      });
      return;
    };
    wx.request({
      url: `${config.baseURL}/user/updatePassword?phone=${this.data.codeCellPhoneInput}&password=${is.password}`,
      method: "put",
      success: (result) => {
        if (result.data.code == 200) {
          wx.navigateBack({
            delta: 1
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }

})