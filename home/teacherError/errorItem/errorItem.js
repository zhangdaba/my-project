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

let questions = [
  // {
  // id: 2,
  // error: '知识点'
  // },
 {
  id: 3,
  error: '章节'
}];

Page({

  data: {
    // 错题划分
    zhangjie: [],
    knowledgePoints: [],// 知识点
    questions,
    arr: [], //全部错题
    knowledges: [], //知识点需要的参数
    all: [], //知识点 章节数据
    wholes: [], //将数据保存在数组中
    imgInx: null,
    ziti: null
  },

  // 章节下的内容
  Knowledge: function(e) {
    let _this = this;
    let item = e.currentTarget.dataset.item;
    let ev = item.errorRate;
    if (ev == null) {
      showToast('暂无数据', '', 1500);
      return;
    }

    let classId = this.data.task_error;

    const token = wx.getStorageSync('Token');

    wx.request({
      url: config.errorURL + '/wrong/getErrorQue',
      data: {
        "chapterId": item.chapterId,
        "classId": classId,
        wx: 'wx'
      },
      header: { 'Token': token },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        let resWholes = res.data.data;
        for (let k in resWholes) {
          resWholes[k].isTrue = 0;
        }
        console.log(resWholes);
        _this.setData({
          wholes: resWholes,
          knowledgePoints: []
        })
      }
    })
  },

  // 查看解析
  viewParsing(e) {
    let idx = e.currentTarget.dataset.idx;
    let wholes = this.data.wholes;
    if (!wholes[idx].isTrue) {
      wholes[idx].isTrue = 1;
    } else {
      wholes[idx].isTrue = 0;
    }
    this.setData({
      wholes
    })
  },

  onLoad: function(options) {

    this.setData({
      task_error: options.task_error
    })
    this.clickTab();
  },

  //点击头部章节和知识点事件+
  clickTab: function(e) {
    var _this = this;

    _this.setData({
      currentTab: 3,
      arr: []
    })

    const Token = wx.getStorageSync('Token');
    let classId = this.data.task_error;
    
    wx.request({
      url: config.errorURL + '/wrong/getChapter?classId=' + classId,
      data: {},
      header: {
        Token: Token
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        //章节下面的所有题目
        let resName = res.data.data;
        let resNameApple = convert(resName, 0);
        resName = IterationDelateMenuChildren(resNameApple);
        _this.setData({
          knowledgePoints: resName,
          wholes: [], //每次点击头部都要先清空数组里面保存的信息
        })
      }
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

  previewImg1: function(e) {
    let imgInx2 = e.currentTarget.dataset.index;
    let dati = e.currentTarget.dataset.dati;
    this.setData({
      imgInx: imgInx2,
      ziti: dati
    })
  },

  //所有题目（大题/小题）
  father: function(e) {
    let fatherIndx = e.currentTarget.dataset.indx;
    let ziti = this.data.ziti; //子题
    let indxImg = this.data.indxImg; //图片位置
    let wholes = this.data.wholes;
    let imgInx = this.data.imgInx;

    let imgArr = [];
    let imgArr1 = [];
    if (ziti == 'ziti') {
      let list = wholes[fatherIndx].subTitleWrongList
      for (let k in list) {
        imgArr.push(list[k].pictureAnswer);
      }
      wx.previewImage({
        current: imgArr[imgInx], //当前图片地址
        urls: imgArr, //所有要预览的图片的地址集合 数组形式
        success: function(res) {
          // console.log(res);
        }
      })
    } else if (ziti == 'dati') {
      for (let k in wholes) {
        imgArr1.push(wholes[k].pictureWrongAnswer);
      }
      wx.previewImage({
        current: imgArr1[imgInx], //当前图片地址
        urls: imgArr1, //所有要预览的图片的地址集合 数组形式
        success: function(res) {
          // console.log(res);
        }
      })
    }
  }
})