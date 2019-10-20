import config from '../../../utils/config.js'

let choice = [{
  id: 0,
  title: '对',
  icon: 'icon-cuo-copy-copy'
}, {
  id: 1,
  title: '错',
  icon: 'icon-duiconverted'
}
// ,
//  {
//   id: 2,
//   title: '半对半错',
//   icon: 'icon--banduibancuo-copy'
// }
]

Page({
  /**
   * 页面的初始数据
   */
  data: {

    notCorrectedss: [],

    indnx: null, //对 错 半对半错

    windowHeight: null,

    // 第一次执行
    wrong_Index: null,

    // 第二次触发
    twoIndx: null,

    // 第三次触发
    threeIndex: null,

    // icon
    wrong: choice,

    // 大题对错
    large_list_Index: null,

    // 批改大题对错
    large_judging: null,

    // 图片位置
    img_indx: null,

    // 图片
    imgTopic: null,

    arrNum: [] //每到题的索引
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function(e) {
    wx.setNavigationBarTitle({
      title: e.title
    })
    // 获取学生要批改的作业
    this.stuCor();
  },

  // 家长要批改的作业
  stuCor() {
    let _this = this;
    let notCorrectedss = wx.getStorageSync('notCorrectedss');
    let num = -1;
    let arrNum = [];
    for (let k in notCorrectedss) {
      num++;
      notCorrectedss[k].index = num;
      arrNum.push(num);
    };
    _this.setData({
      notCorrectedss: notCorrectedss,
      arrNum: arrNum
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function() {
    // 获取屏幕高度
    this.height();
  },

  // 第一次点击的时候
  wrong_Item: function(e) {
    let _this = this;
    let minorTopic_index = e.currentTarget.dataset.index;
    let minorTopic_data = e.currentTarget.dataset.judging;
    _this.setData({
      wrong_Index: minorTopic_index,
      large_judging: minorTopic_data
    })
  },

  // 第二次执行
  wrong_List: function(e) {
    let _this = this;
    let twoIndx = e.currentTarget.dataset.twoindx;
    _this.setData({
      twoIndx: twoIndx
    })
  },

  // 第三次执行
  threeChoice: function(e) {
    let _this = this;
    let twoIndx = _this.data.twoIndx;
    let threeIndex = e.currentTarget.dataset.indx; //索引
    let notCorrectedss = _this.data.notCorrectedss; //后台数据
    let imgTopic = _this.data.imgTopic;
    
    let large_judging = _this.data.large_judging; //大题对错

    // 判断当前点击的是否为图片
    if (imgTopic == 'imgTopic') {
      let imgArr = [];
      // 有小题 的 图片
      let img_list_item = notCorrectedss[threeIndex].subQuestionAnswers;

      for (let k in img_list_item) {
        imgArr.push(img_list_item[k].pictureAnswer);
      };

      let img_indx = _this.data.img_indx;
      console.log(imgArr, img_indx);
      wx.previewImage({
        current: imgArr[img_indx], //当前图片地址
        urls: imgArr, //所有要预览的图片的地址集合 数组形式
        success: function(res) {}
      })

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
      // console.log('内容', newArr);
      wx.previewImage({
        current: newArr[threeIndex], //当前图片地址
        urls: newArr, //所有要预览的图片的地址集合 数组形式
        success: function(res) {
          console.log(res);
        },
        fail: function(error) {
          console.log('失败回调', error);
        }
      })

      // 对 错 半对半错 逻辑
    } else if (large_judging == 'large_judging') {

      // 判断当前大题的是否有小题
      if (notCorrectedss[threeIndex].isSub == 1) {

        // 获取当前大题 对 错 半对半错
        let wrong_Index = _this.data.wrong_Index;

        // 改变当前大题中小题集合的状态
        notCorrectedss[threeIndex].subQuestionAnswers[twoIndx].isTrue = wrong_Index;

        // 当只有大题的情况
      } else if (notCorrectedss[threeIndex].isSub == 0) {

        // 获取到当前大题的index
        let large_list_index = _this.data.large_list_Index;

        //  改变当前大题的index状态
        notCorrectedss[threeIndex].isTrue = large_list_index;
      };

      // 如果不是点击的图片也不是判读对错
    } else {
      return;
    };

    // 重新渲染视图
    _this.setData({
      threeIndex,
      imgTopic: null,
      large_judging: null,
      notCorrectedss
    });
  },

  // 获取屏幕高度
  height: function() {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },

  // 批改 大题 程序
  large_list: function(e) {

    let _this = this;
    let totalLarge = e.currentTarget.dataset;

    let large_list_Index = totalLarge.index;

    let large_judging = totalLarge.judging;

    _this.setData({
      large_list_Index,
      large_judging
    });

  },

  // 判断当前点击为图片 图片样式
  previewImg: function(e) {
    let _this = this;
    let img_indx = e.currentTarget.dataset.index;
    let imgTopic = e.currentTarget.dataset.img;
    _this.setData({
      img_indx,
      imgTopic
    });
  },

  // 滑动时触发
  bind: function() {
    // console.log('滑动时触发');
  },

  // 提交
  Submission: function() {
    let _this = this;
    let notC = _this.data.notCorrectedss;
    console.log(notC, 'notC');
    
    // for(let k in notC) {
    //   if (notC[k].isSub == 1) {
    //     for (let i in notC[k].subQuestionAnswers) {
    //       if (notC[k].subQuestionAnswers[i].isTrue == null) {
    //         wx.showToast({
    //           title: '当前还有没有批改完成的题型',
    //           icon: 'none',
    //           duration: 2000
    //         })
    //         return;
    //       }
    //     }
    //   } else if (notC[k].isTrue == null) {
    //     wx.showToast({
    //       title: '当前还有没有批改完成的题型',
    //       icon: 'none',
    //       duration: 2000
    //     })
    //     return;
    //   }
    // }

    wx.request({
      url: config.taskURL + '/correction/sub_corr',
      data: notC,
      header: {
        //'Content-Type' : 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          setTimeout(function() {
            wx.navigateBack();
          }, 300);
        }
      }
    })
  },

  // index 找到当前题型
  arrNumClick(e) {
    this.setData({
      next: e.currentTarget.dataset.item
    })
  }

})