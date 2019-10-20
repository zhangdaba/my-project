import config from '../../../utils/config.js'

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */

  data: {
    chapterInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    let bookStorage = wx.getStorageSync('Selection');
    wx.request({
      url: config.listURL + '/message/getChapter',
      data: {
        editionId: bookStorage.editionId,
        gradeId: bookStorage.bookId,
        subjectId: bookStorage.subjectId
      },
      header: {},
      method: 'GET',
      responseType: 'text',
      success: res => {
        let dataValue = res.data.data;
        let convertName = this.convert(dataValue, 0);
        this.IterationDelateMenuChildren(convertName);
        _this.setData({
          chapterInfo: this.data.dataValue
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  chapter: function(e) {
    let chapId = e.currentTarget.dataset.chap;
    let url = '../setting/setting';
    wx.setStorageSync('chapItem', chapId);
    wx.navigateTo({
      url: url,
      success: function(res) {}
    })
  },

  // 数据递归
  convert(data, parentIds) {
    var convertData = [];
    data.forEach((item, index) => {
      if (item.parentId == parentIds) {
        convertData.push(item);
        this.convertChildren(data, item, item.id);
      }
    });
    return convertData;
  },

  // 递归整合
  convertChildren(arr, parentItem, parentIds) {
    parentItem.children = parentItem.children ? parentItem.children : [];
    arr.forEach(item => {
      if (item.parentId == parentIds) {
        parentItem.children.push(item);
        this.convertChildren(arr, item, item.id);
      }
    });
    return parentItem.children;
  },

  // 去除空的children目录
  IterationDelateMenuChildren(arr) {
    if (arr.length) {
      for (let i in arr) {
        if (arr[i].children.length) {
          this.IterationDelateMenuChildren(arr[i].children);
        } else {
          delete arr[i].children;
        }
      }
    }
    this.setData({
      dataValue: arr
    })
  }

})