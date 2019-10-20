import config from '../../../utils/config.js'

Page({
  data: {
    index: 0,
    // 级联选择器
    arr: '请选择',
    isNode: false,
    array: ['美国', '中国', '巴西', '日本'],
    content: '', // 输入框中内容
    region: ['上海省','上海市','普陀区'],
    school: []
  },

  bindevent(e) {
    // 选中项的value索引
    console.log(e.detail.value)
    // 选中项的值
    console.log(this.data.array[e.detail.value])
    this.setData({
      index: e.detail.value,
      isNode: true
    })
  },

  // 文本框实时事件
  search: function(e) {

    let _this = this;
    let server = e.detail.value;
    
    if (!server || server =='_') {
      _this.setData({
        school: []
      })
      return;
    }

    wx.request({
      url: config.itemURL + '/school/list',
      data: { 'schoolName': server },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        _this.setData({
          school: res.data.data
        });
      }
    });
  },

  inputBind: function(e) {
    let inputValue = e.detail.value;
    let _this = this;
    _this.setData({
      content: e.detail.value
    })
  },

  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },

  // 选中学校
  school: function(e) {
    wx.setStorageSync('school', e.currentTarget.dataset.item);
    let schoolId = e.currentTarget.dataset.item.id;
    const token = wx.getStorageSync('Token');
    wx.request({
      url: config.itemURL + '/grade/list/' + schoolId,
      data: '',
      header: '',
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        if (res.data.code == 200) {
          let school = wx.getStorageSync('school');
          let className = res.data.data;
          wx.setStorageSync("className", className);
          const classNameItem = wx.getStorageSync("className");
          
          const user = wx.getStorageSync('user');
          if (user.role == "教师") {
            wx.navigateTo({
              url: '../bindingClass/class'
            });
          } else if (user.role == "家长") {
            wx.navigateTo({
              url: '../../../parent/home/binding/children',
            })
          }

          // wx.showModal({
          //   title: '提示',
          //   content: '当前为选择为' + school.name,
          //   success(res) {
          //     if (res.confirm) {
              
          //     }
          //   }
          // });

        } else {
          wx.showToast({
            title: '选择失败',
            icon: 'none',
            duration: 800
          })
        }
      }
    })
  }
})