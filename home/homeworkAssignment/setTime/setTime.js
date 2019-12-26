var utils = require('../../../utils/util.js'); //引入微信自带的日期格式化
import config from '../../../utils/config.js'
const app = getApp();
Page({

  data: {
    endtime: '' || '22:00',
    date: '',
    chapItem: '', // 名称
    evIndex: null,
    evTask: null,
    releases: [{
        id: 0,
        title: '预习作业'
      },
      {
        id: 2,
        title: '课中作业'
      },
      {
        id: 1,
        title: '课后作业'
      }
    ]
  },

  onLoad() {
    let chapItem = wx.getStorageSync('chapItem');
    this.setData({
      chapItem: chapItem.chapter,
      date: this.getNowFormatDate()
    })
  },

  // 作业当前日期
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  // 结束时间
  endTimeChange: function(e) {
    this.setData({
      endtime: e.detail.value
    })
  },

  // 结束日期
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  // 作业名称
  inputContent(e) {
    this.setData({
      chapItem: e.detail.value
    })
  },

  // 课中 课前 课后 start
  releasesClick(e) {
    let ev = e.currentTarget.dataset;
    let evIndex = ev.idx;
    this.setData({
      evIndex: evIndex,
      evTask: ev.item
    })
  },
  // 课中 课前 课后 end

  // 提交布置
  submit() {
    if (this.data.evTask === null) {

      wx.showToast({
        title: '请选择课中 | 预习 | 课后作业',
        icon: 'none',
        duration: 1200
      })
      return;
    }

    let strTime = this.data.date + ' ' + this.data.endtime //获取用户输入的时间

    let date = new Date(strTime.replace(/-/g, '/')); // 过滤

    let currentTime = new Date().getTime(); //当前时间

    let time = date.getTime(); //  设置时间

    if (currentTime > time) { //比较 如果当前时间 大于 结束时间

      wx.showToast({
        title: '日期输入错误',
        icon: 'none',
        duration: 800
      })
      return;
    }
    
    // 获取本地token
    const value = wx.getStorageSync('Token')

    // 获取设置的作业
    let assignment = wx.getStorageSync('assignment');

    // 获取班级的id
    const selection = wx.getStorageSync('Selection');

    let chapItem = wx.getStorageSync('chapItem');

    let evTaskName = this.data.chapItem || chapItem.chapter;

    let msgTopic = {
      "classId": selection.id,
      "bookId": selection.bookId,
      "editionId": selection.editionId,
      "subjectId": selection.subjectId,
      "operationEndTime": String(time),
      "resourceName": evTaskName,
      'chapterId': chapItem.id,
      "homeworkType": this.data.evTask.id,
      "queIds": assignment
    };
    
    wx.request({
      url: config.itemURL + '/homework/create',
      data: msgTopic,
      method: "POST",
      header: {
        Token: value
      },

      success(res) {
        if (res.data.code == 200) {
          utils.showTextToast('布置成功', 1500, 'success');
          setTimeout(function() {
            wx.navigateBack({
              delta: 8
            });
          }, 800)
        } else {
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    })

  }

})