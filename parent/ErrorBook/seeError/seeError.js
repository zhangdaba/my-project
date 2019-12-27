import config from '../../../utils/config.js'
import {
  convert,
  IterationDelateMenuChildren
} from '../../../utils/util.js'

function showToast(title, icon, duration) {
  wx.showToast({
    title: title,
    icon: icon || 'none',
    duration: duration || 1500
  })
}

let questions = [{
    id: 1,
    error: '章节'
  }
  // ,
  //  {
  //   id: 2,
  //   error: '知识点'
  // }
];

Page({

  /**
   * 页面的初始数据
   */

  data: {
    // 错题划分
    questions,
    wholes: [], //全部错题
    as: [], //所有的题
    chapters: [], //所有章节
    itemError: '', //知识点 学科 全部
    checkbox: []
  },
  
  checkboxChange(e) {
    this.setData({
      checkbox: e.detail.value
    });
  },
  
  switchTab: function(e) {
    let _this = this;
    // 通过事件冒泡获取Id

    // let itemId = e.target.dataset.item;
    let itemId = {
      id: 2
    }

    _this.setData({
      itemError: itemId.error
    });

    switch (itemId.id) {
      case 1:
        _this.whole();
        break;
      case 2:
        _this.knowledge();
        break;
      case 3:
        _this.subject();
        break;
      default:
        break;
    }
  },

  // 章节下的 错题
  divide: function(e) {
    let _this = this;
    let chapterId = e.currentTarget.dataset.item.chapterId;
    const ChildList = wx.getStorageSync('ChildrenItem');
    let subject = _this.data.subject;

    wx.request({
      url: config.errorURL + '/wrong/getErrorQueOfParent',
      data: { 'stuId': ChildList.id, 'chapterId': chapterId, 'subjectId': subject  },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.code == 200) {
          if (!res.data.data.length) {
            wx.showToast({
              title: '暂无内容',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          _this.setData({
            wholes: res.data.data,
            chapters: []
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    _this.setData({
      subject: options.subjectId
    })

    // 知识点
    _this.knowledge();
  },
  
  // 知识点
  knowledge: function() {
    let _this = this;
    const ChildList = wx.getStorageSync('ChildrenItem');
    const token = wx.getStorageSync('Token');
    // console.log(ChildList, token, this.data.subject);

    wx.request({
      url: config.errorURL + '/wrong/getChapterOfParent?classId=' + ChildList.classId + '&subjectId=' + _this.data.subject + '&stuId=' + ChildList.id,
      data: '',
      header: {},
      method: 'GET',
      success: function(res) {
        if (res.data.code == 200) {
          let wholeRes = res.data.data;
          if (!wholeRes) {
            wx.showToast({
              title: '暂无错题',
            })
            return;
          };
          wholeRes = convert(wholeRes, 0);
          wholeRes = IterationDelateMenuChildren(wholeRes);
          _this.setData({
            chapters: wholeRes,
            wholes: [],
          })
        }
      }
    })
  },

  Knowledge(e) {
    let _this = this;
    let chapterId = e.currentTarget.dataset.item.chapterId;
    const ChildList = wx.getStorageSync('ChildrenItem');
    let subject = _this.data.subject;
    
    wx.request({
      url: config.errorURL + '/wrong/getErrorQueOfParent',
      data: { 'stuId': ChildList.id, 'chapterId': chapterId, 'subjectId': subject, wx: 'wx' },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.code == 200) {
          let names = res.data.data;
          if (!names || !names.length) {
            wx.showToast({
              title: '本章没有错题',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          _this.setData({
            wholes: res.data.data,
            chapters: []
          })
        }
      }
    });
  },

  // 题型
  subject: function() {
    let _this = this;
    const ChildList = wx.getStorageSync('ChildrenItem');
    wx.request({
      url: config.errorURL + '/wrong/selectQuestion?stuId=' + ChildList.id + '&subject=' + _this.data.subject,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.code == 200) {
          _this.setData({
            knowledges: res.data.data
          });
        }
      }
    })
  },

  // 事件冒泡
  father: function(e) {
    let fatherIndx = e.currentTarget.dataset.indx;
    let ziti = this.data.ziti; //子题
    let indxImg = this.data.indxImg; //图片位置
    let wholes = this.data.wholes;
    let imgInx = this.data.imgInx;

    // let imgArr = [];
    let imgArr1 = [];
    // if (ziti == 'ziti') {
    //   let list = wholes[fatherIndx].subTitleWrongList
    //   for (let k in list) {
    //     imgArr.push(list[k].pictureAnswer);
    //   }
    //   wx.previewImage({
    //     current: imgArr[imgInx], //当前图片地址
    //     urls: imgArr, //所有要预览的图片的地址集合 数组形式
    //     success: function(res) {
    //       console.log(res);
    //     }
    //   })
    // }

    if (ziti == 'dati') {
      console.log(imgInx, wholes, fatherIndx);
      let list = wholes[fatherIndx].studentResps;
      for (let k in list) {
        imgArr1.push(list[k].picturePath);
      }
      // console.log(imgArr1);
      // return;
      wx.previewImage({
        current: imgArr1[imgInx], //当前图片地址
        urls: imgArr1, //所有要预览的图片的地址集合 数组形式
        success: function(res) {
          console.log(res);
        }
      })
    }

    this.setData({
      ziti: ''
    })
  },

  // 样式
  previewImg: function(e) {
    let imgInx = e.currentTarget.dataset.indx;
    let ziti = e.currentTarget.dataset.ziti;
    this.setData({
      imgInx,
      ziti
    });
  },

  // 大题图片
  previewImg1: function(e) {
    let imgInx2 = e.currentTarget.dataset.index;
    let dati = e.currentTarget.dataset.dati;
    this.setData({
      imgInx: imgInx2,
      ziti: dati
    })
  },

  hidden(e) {
    let idx = e.currentTarget.dataset.idx;
    let wholesRes = this.data.wholes;
    if (!wholesRes[idx].isTrue) {
      wholesRes[idx].isTrue = 1;
    } else {
      wholesRes[idx].isTrue = 0;
    }
    this.setData({
      wholes: wholesRes
    })
  }
})