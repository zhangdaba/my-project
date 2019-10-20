import config from '../../../utils/config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuName: [] //学生列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  // 监听页面 显示
  onShow: function() {
    this.student();
  },
  // 获取学生列表
  student: function() {
    let _this = this;
    let notCorrecteds = wx.getStorageSync('notCorrected');

    wx.request({
      url: config.itemURL + '/student/getStuToTeacher',
      data: {
        homework_id: notCorrecteds.homeworkId
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        let resAnd = res.data.data;
        let notRes = [],
            readyRes = [],
            comRes = [];
        for (let q in resAnd) {
          if (resAnd[q].submitHomeworkStatus == 0) {
            notRes.push(resAnd[q]);
          } else if (resAnd[q].submitHomeworkStatus == 1) {
            readyRes.push(resAnd[q]);
          } else if (resAnd[q].submitHomeworkStatus == 2) {
            comRes.push(resAnd[q]);
          }
        }
        _this.setData({
          stuName: res.data.data,
          notRes,
          readyRes,
          comRes
        })
      }
    })

  },

  bind_comRes: function(e) {
    let _this = this;
    let ev = e.currentTarget.dataset;
    console.log(ev.item.stuName, 'ev');
    let submitHomeworkId = ev.item.submitHomeworkId;

    wx.request({
      url: config.itemURL + '/correction/get_que',
      data: { submitHomeworkId: submitHomeworkId, wx: 'wx' },
      header: {},
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 200) {
          let notCorrectedss = res.data.data;
          if (!notCorrectedss.length) {
            wx.showToast({
              title: '暂无批改内容',
              icon: 'none',
              duration: 800
            })
            return;
          };
          wx.setStorageSync('notCorrectedss', notCorrectedss);
          wx.navigateTo({
            url: '../Correcting/Correcting?title=' + ev.item.stuName
          })
        }
      }
    })
    // switch (pigai) {
    //   case '未批改':
    //     _this.weipigai(submitHomeworkId);
    //     break;
    //   case '已批改':
    //     _this.yipigai(submitHomeworkId);
    //     break;
    //   default:
    //     console.log('默认代码块');
    //     break;
    // }
  }
})