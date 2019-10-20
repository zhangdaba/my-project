import util from '../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    identitys: [],
    idx: -1,      //身份
    name: '',    //身份选择
    count: false,
    getphoto: '', //手机号
   // codename: '获取验证码',  //存放验证码
    disabled: false
  },

  //身份选择
  goIndex: function(e) {
    let _this = this;
    let index = e.currentTarget.dataset.index + 1;
    let name = e.currentTarget.dataset.item;
    _this.setData({
      idx: index,
      name: name
    })
  },

  //表单提交
  formSubmit: function (e) {
    var _this = this;
    //事件对象 获取表单内容
    let ev = e.detail.value;
    // 获取身份 与 身份ID
    let name = _this.data.name;
    let _ID = _this.data.idx;
    // 添加身份到对象 ev 中
    ev.identity = name;

    // 手机号的正则表达式
    let phoneReg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/

    // 密码的正则表达式
    var mima = /^(\w){6,12}$/

    // 名字的正则表达式
    var nameReg = /^[\u4E00-\u9FA5]{2,4}$/

    if(name == "") {
      util.showTextToast('请选择身份', 1000)
      return '';
    } else if(!ev.phone.trim()){
      util.showTextToast('手机号不能为空', 1000)
      return '';
    } else if (!phoneReg.test(ev.phone)){
      util.showTextToast('手机格式不正确', 1000)
      return '';
    } else if (!mima.test(ev.password)) {
      util.showTextToast('密码格式不正确 / 密码为空', 1500)
      return '';
    } else
    if(!ev.confirm.trim() || !ev.password.trim()) {
      util.showTextToast('密码不能为空', 1000)
      return '';
    } else if (ev.confirm.trim() !== ev.password.trim()) {
      util.showTextToast('两次密码不一致', 1000)
      return '';
    } else if (!nameReg.test(ev.username)) {
      util.showTextToast('请输入正确的姓名格式', 1500)
      return '';
    } else {
      delete ev.confirm;
      delete ev.verification
      let _ID1 = _ID + 1;
      ev.roleId = _ID1;
      delete ev.identity
      delete ev.name;
      // header: { 'Content-Type': 'application/json' }
      util.post('/user/register', ev, {},function(res) {
        if(res.data.code == "200") {
          util.showTextToast('认证完成', 1000, "success");
          setTimeout(function() {
            wx.navigateBack()
          }, 1000)
        } else {
          util.showTextToast('该用户已经注册', 1000);
        }
      })
    }
  },

  //双向绑定手机号
  getphoto: function (e){
    this.setData({
      getphoto: e.detail.value
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.identity();
  },

  // 获取用户身份
  identity: function() {
    var _this = this;
    util.getJSON('/role/list', {}, function (res) {
      if(res.data.code == '200') {
      _this.setData({
        identitys: res.data.data
      })
      }
    })
  }

})