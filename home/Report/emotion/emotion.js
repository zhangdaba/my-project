import config from '../../../utils/config.js'
import {
  convert,
  IterationDelateMenuChildren,
  formatSeconds
} from '../../../utils/util.js'

function showToast(title = '空', icon = 'none', duration = 800) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  })
}

let questions = [
  {
    id: 1,
    error: '章节'
  }
  // ,
  // {
  //   id: 2,
  //   error: '知识点'
  // }
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions,
    // 章节
    knowledges: [],
    // 知识点
    chapters: [],

    // 占比例
    proportionIndex: false,

    switchindx: null,

    // 点的是知识点还是章节
    evIndx: null,

    // 章节 知识点
    knowledgeName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.clickTab()
  },

  // 知识点 或 章节
  clickTab: function(e) {
    this.chapter('章节');
    // let _this = this;
    // let evIndx = e.currentTarget.dataset.item.id;
    // let reportAll = e.currentTarget.dataset.item.error;
    // console.log(reportAll, evIndx);
    // return;
    // this.setData({
    //   evIndx: evIndx,
    //   knowledgeTopAll: [],
    //   switchindx: e.target.dataset.indx,
    //   whiles: []
    // })

    // switch (evIndx) {
    //   case 1:
    //     _this.chapter(reportAll);
    //     break;
    //   case 2:
    //     _this.knowledge(reportAll);
    //     break;
    //   default:
    //     console.log('都不执行代码块');
    //     break;
    // }
  },

  // 章节目录
  chapter(reportAll) {
    let getClass = wx.getStorageSync('getClass');
    let token = wx.getStorageSync('Token');
    wx.request({
      url: config.reportURL + '/report/getChapter?classId=' + getClass.id,
      data: {},
      header: {
        'Token': token
      },
      method: 'GET',
      success: (res) => {

        let resArr = res.data.data;
        let convertName = convert(resArr, 0);
        convertName = IterationDelateMenuChildren(convertName);

        this.setData({
          knowledges: [],
          knowledgeTopAll: [],
          reportAll: convertName,
          whiles: []
        });
      }
    })
  },

  // 每一章节内容
  reportAll: function(e) {
    let knowledge = e.currentTarget.dataset.item;
    const token = wx.getStorageSync('Token');
    if (knowledge.chapterAccuracy === null) {
      showToast('暂无学情报告', 'none', 1500);
      return;
    }
    this.setData({
      knowledgeName: knowledge.chapterName
    });
    const getClass = wx.getStorageSync('getClass');
    wx.request({
      url: config.reportURL + '/report/getHomework?chapterId=' + knowledge.chapterId + '&classId=' + getClass.id,
      data: '',
      header: {
        'Token': token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {

        let self = res.data.data;
        for(let k in self) {
          self[k].answerTime = formatSeconds(self[k].answerTime);
        }
        
        this.setData({
          knowledgeTopAll: self,
          reportAll: [],
          knowledges: [],
          whiles: []
        })
      }
    })
  },

  // 占比例
  proportion: function() {

    // function bubbleSort(arr) {
    //   let { length } = arr;
    //   for (let i = 0; i <length; i++) {
    //     for (let j = 0; j < length - i - 1; j++) {
    //       if (length[j].accuracy > length[j + 1].accuracy) {
    //         let t = length[j];
    //         length[j] = length[j + 1]
    //         length[j + 1] = t
    //       }
    //     }
    //   }
    // }

    let proportionIndex = !this.data.proportionIndex;
    let knowledgeTopAll = this.data.knowledgeTopAll;
    this.setData({
      proportionIndex
    });
    let i, j;
    if (proportionIndex) {
      for (i = 0; i < knowledgeTopAll.length; i++) {
        for (j = 0; j < knowledgeTopAll.length - i - 1; j++) {
          if (knowledgeTopAll[j].accuracy > knowledgeTopAll[j + 1].accuracy) {
            let t = knowledgeTopAll[j];
            knowledgeTopAll[j] = knowledgeTopAll[j + 1]
            knowledgeTopAll[j + 1] = t
          }
        }
      }
    } else {
      for (i = 0; i < knowledgeTopAll.length; i++) {
        for (j = 0; j < knowledgeTopAll.length - i - 1; j++) {
          if (knowledgeTopAll[j].accuracy < knowledgeTopAll[j + 1].accuracy) {
            let t = knowledgeTopAll[j];
            knowledgeTopAll[j] = knowledgeTopAll[j + 1]
            knowledgeTopAll[j + 1] = t
          }
        }
      }
    }
    this.setData({
      knowledgeTopAll: knowledgeTopAll
    })
  },

  // 查看每一位学生
  topAllStudent: function(e) {
    let evIndex = this.data.evIndx;
    const getClass = wx.getStorageSync('getClass');
    let evClass = e.currentTarget.dataset.item; // source: evClass.source, 来源
    if (evClass.accuracy === null) {
      showToast();
      return;
    }

    wx.request({
      url: config.reportURL + '/report/getQuestion',
      data: { homeworkId: evClass.homeworkId, wx: 'wx' },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let self = res.data.data;
        
        for (let k in self) {
          if (self[k].avgAnswerTime < 1) {
            self[k].avgAnswerTime = Math.ceil(self[k].avgAnswerTime);
          } else {
            self[k].avgAnswerTime = Math.round(self[k].avgAnswerTime);
          }
        }

        this.setData({
          knowledgeTopAll: [],
          whiles: res.data.data
        });
      }
    })

  },

  whilesBind(e) {
    // console.log(e);
    // let idx, item, ev;
    // ev = e.currentTarget.dataset;
    // idx = ev.idx;
    // item = ev.item;
    // wx.request({
    //   url: config.reportURL + '/report/getStudent',
    //   data: { homeworkId: },
    //   header: {},
    //   method: 'GET',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function(res) {
    //     console.log(res);
    //   }
    // })
  },

  // 详情页
  xiangqing: function(e) {
    let indx = e.currentTarget.dataset.indx;
    let whiles = this.data.whiles;

    if (whiles[indx].is) {
      whiles[indx].is = false;
    } else {
      whiles[indx].is = true;
    }

    this.setData({
      whiles: whiles
    })
  }
})