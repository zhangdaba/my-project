import config from '../../../utils/config.js'

let currentMidX = 0.0
let currentMidY = 0.0
let CodePoint = 1.524;  //  码点大小
let A4W = 210
let A4H = 297
let ratio = 0.0 // 对画布等比例缩放
let aggregateArr = []

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 班级
    correctingItem: null,
    next: 0,
    choices: ['半对半错', '对', '错'],
    state: null,
    // 真实数据
    notCorrectedss: [],
    indnx: null, //对 错 半对半错
    windowHeight: null,
    windowWidth: null
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    // 获取屏幕高度
    this.height();
    this.setData({
      state: options.id
    });
    // this.aaa(options.homeworkId, options.id);
    this.aaa(975315575849746, 2);
  },
  
  aaa(homeworkId, optionsId) {
    let self = this;
    let ChildrenItem = wx.getStorageSync('ChildrenItem');
    wx.request({
      url: config.itemURL + '/homework/getQuestionAndDots',
      data: {
        homeworkId,
        clickSource: optionsId,
        stuId: ChildrenItem.id,
        wx: 'wx'
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 200) { // 原始比例: width:2481 height:463.4814572318234
          const subSee = res.data.data;
          subSee.sort((a, b) => a.queNo - b.queNo)
          self.setData({
            notCorrectedss: subSee
          })
          self.subSeeClick(subSee)
        } else if (res.data.code == 4004) {
          wx.showToast({
            title: '系统正在批改中，请稍后查看',
            icon: 'none',
            duration: 2000
          });
          setTimeout(() => {
            wx.navigateBack({delta: 1});
          } ,2000)
        };
      },
      fail(err) {
        if(err.errMsg == 'request:fail timeout') {
          wx.showToast({
            title: '连接超时，请稍后再试...',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  
  subSeeClick(subSee) {
    for (let i = 0; i < subSee.length; i++) {
      const context = wx.createCanvasContext(`canvas${i}`)
      let width = subSee[i].width
      let height = subSee[i].height
      aggregateArr.push(context)  // 存储点数据
      // 每个点数据运算
      let dotList = this.pointOperation(subSee[i], 1, 0, 0)
      // 模拟 运算前 abX: 89.39 abY: 24.38 运算后 abX: 498.213888 (保留:abY: 24.38)
      this.PointData(context, dotList, width, height, subSee[i].pictureAnswer)
    }
  },

  pointOperation(dots, ratio, offsetX, offsetY) {
    let xyPoints = dots.dotList
    let sobps = dots.sobps || ['0000']
    for (let k in xyPoints) {
      for (let i in sobps) {
        if (xyPoints[k].sobp == sobps[i]) {
          xyPoints[k].abX = (xyPoints[k].abX) * (2481 / A4W * CodePoint)  - dots.startX
          // 271 ：第一页最下部分和第二页最上部分为空白, 故做删除后拼接处理，271=297-2△y
          xyPoints[k].abY = (xyPoints[k].abY) * ( 3508 / A4H * CodePoint)  - dots.startY
          // xyPoints[k].abY = (xyPoints[k].abY - offsetY) * ( this.data.windowHeight / A4H * CodePoint)  - dots.startY * ratio + i * (271 * (this.data.windowHeight / A4H)* ratio)
        }
      }
    }
    return xyPoints
  },

  playback(e) {
    let dataset = e.currentTarget.dataset
    let item = dataset.item
    let aIdx = aggregateArr[dataset.idx]
    let dotList = this.pointOperation(item, ratio, 0, 0)
    aIdx.beginPath()
    aIdx.clearRect(0, 0, item.width, item.height)
    aIdx.drawImage(item.pictureAnswer, 0, 0, item.width, item.height)
    aIdx.draw(true)
    let i = -1
    clearInterval(this.timer)
    this.timer = setInterval(()=> {
      i++
      if(dotList.length === i) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.lineFunction(i, dotList ,aIdx)
    }, 26)
  },

  PointData(context, dotList ,Hwidth, Hheight, pictureAnswer) {
    // context.beginPath()
    // context.drawImage(pictureAnswer, 0, 0, Hwidth, Hheight)
    // context.stroke()
    // context.draw(true)
    dotList.forEach((item, i, array) => {
      this.lineFunction(i, array, context)
      // console.log(array[i].abX, array[i].abY)
    })
  },

  lineFunction(i, array, context) {
    if(array[i] === undefined) return
    let preX = array[i].abX
    let preY = array[i].abY
    switch (array[i].dotType) {
      case "PEN_DOWN":
        context.beginPath();
        context.moveTo(array[i].abX, array[i].abY);
        currentMidX = preX;
        currentMidY = preY;
        break
      case "PEN_MOVE":
        context.beginPath();
        context.moveTo(currentMidX, currentMidY);
        context.lineTo(preX, preY);
        context.stroke();
        context.draw(true);
        // log(currentMidX, currentMidY, "MOVE");
        currentMidX = preX; // 保存下一个点, 并对上一个点进行覆盖
        currentMidY = preY;
        break;
      case "PEN_UP":
        context.draw(true);
        break
    }
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

  // 获取屏幕高度
  height: function () {
    let self = this;
    wx.getSystemInfo({
      success(res) {
        self.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },

  // 小题学生答案图片
  previewImg: function (e) {
    let self = this;
    let ev = e.currentTarget.dataset;
    let img_indx = ev.index;
    let imgTopic = ev.img;
    self.setData({
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
    let self = this;
    let twoIndx = self.data.twoIndx;
    let notCorrectedss = self.data.notCorrectedss; //后台数据
    let threeIndex = e.currentTarget.dataset.indx; //索引
    // console.log('获取当前大题位置', threeIndex);
    let imgTopic = self.data.imgTopic;
    // 判断当前点击的是否为图片
    if (imgTopic == 'imgTopic') {
      let imgArr = [];
      // 有小题 的 图片
      let img_list_item = notCorrectedss[threeIndex].subQuestionAnswers;
      for (let k in img_list_item) {
        imgArr.push(img_list_item[k].pictureAnswer);
      }
      let img_indx = self.data.img_indx;
      wx.previewImage({
        current: imgArr[img_indx], //当前图片地址
        urls: imgArr, //所有要预览的图片的地址集合 数组形式
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
        current: newArr[threeIndex], //当前图片地址
        urls: newArr, //所有要预览的图片的地址集合 数组形式
        success: function (res) {
          console.log(res);
        }
      })
    }
    // 重新渲染视图
    self.setData({
      threeIndex,
      imgTopic: null,
      notCorrectedss
    });
  }
})