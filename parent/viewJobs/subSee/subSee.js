import config from '../../../utils/config.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 班级
    correctingItem: null,
    next: 0,
    choices: ['半对半错', '对','错'],

    // 真实数据
    notCorrectedss: [],
    indnx: null, //对 错 半对半错
    windowHeight: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取屏幕高度
    this.height();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function () {
    this.setNavigationBarTitle();
  },

  setNavigationBarTitle: function () {
    const childList = wx.getStorageSync('ChildrenItem');
    wx.setNavigationBarTitle({
      title: childList.name
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    let subSee = wx.getStorageSync('subSee');
    
    _this.setData({
      notCorrectedss: subSee
    });

  },

  // 获取屏幕高度
  height: function () {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },

  // 小题学生答案图片
  previewImg: function (e) {
    let _this = this;
    let ev = e.currentTarget.dataset;
    let img_indx = ev.index;
    let imgTopic = ev.img;
    _this.setData({
      img_indx,
      imgTopic
    });
  },
  
  previewImg1: function (e) {
    let imgTopic1 = e.currentTarget.dataset.img;
    let img_indx1 = e.currentTarget.dataset.index;
    this.setData({
      imgTopic: imgTopic1,
      img_indx: img_indx1
    });
  },

  threeChoice: function (e) {
    let _this = this;
    let twoIndx = _this.data.twoIndx;
    let notCorrectedss = _this.data.notCorrectedss; //后台数据
    let threeIndex = e.currentTarget.dataset.indx; //索引
    // console.log('获取当前大题位置', threeIndex);

    let imgTopic = _this.data.imgTopic;
    // 判断当前点击的是否为图片
    if (imgTopic == 'imgTopic') {
      let imgArr = [];
      // 有小题 的 图片
      let img_list_item = notCorrectedss[threeIndex].subQuestionAnswers;
      for (let k in img_list_item) {
        imgArr.push(img_list_item[k].pictureAnswer);
      }
      let img_indx = _this.data.img_indx;
      wx.previewImage({
        current: imgArr[img_indx],  //当前图片地址
        urls: imgArr,               //所有要预览的图片的地址集合 数组形式
        success: function (res) {
          console.log(res);
        }
      })
      // 大题图片
    } else if (imgTopic == 'imgTopic1') {
      let imgArr2 = [];

      for (let k in notCorrectedss) {
        imgArr2.push(notCorrectedss[k]);
      }

      // 大题中所有图片路径
      let newArr = [];
      for (let i in imgArr2) {
        newArr.push(imgArr2[i].pictureAnswer);
      }

      wx.previewImage({
        current: newArr[threeIndex],     //当前图片地址
        urls: newArr,           //所有要预览的图片的地址集合 数组形式
        success: function (res) {
          console.log(res);
        }
      })
    }
    
    // 重新渲染视图
    _this.setData({
      threeIndex,
      imgTopic: null,
      notCorrectedss
    });
  }

})