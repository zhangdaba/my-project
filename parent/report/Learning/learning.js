import config from '../../../utils/config.js'
import {
  convert,
  IterationDelateMenuChildren,
  formatSeconds
} from '../../../utils/util.js'

let questions = [{
    id: 1,
    error: '章节'
  }
  // ,
  // {
  //   id: 2,
  //   error: '知识点'
  // }
];

function showToast(title, icon, duration) {
  wx.showToast({
    title: title || '提示',
    icon: icon || 'none',
    duration: duration || 1500
  })
}

Page({

  data: {
    questions,
    indx: null,
    switchClass: null,
    kemuId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {;
  console.log(options);
    this.setData({
      kemuId: options.kemuId
    })
    this.clickTab();
  },

  clickTab: function(e) {
    let _this = this;
    // let indx = e.target.dataset.indx;
    let indx = 0;
    // let switchClass = e.target.dataset.item.error;
    this.setData({
      indx: indx
      // ,
      // switchClass: switchClass
    });
    // const emotion = e.currentTarget.dataset.item.id;
    const emotion = 1;
    switch (emotion) {
      case 1:
        _this.chapter(emotion);
        break;
      case 2:
        _this.knowledge(emotion);
        break;
      default:
        '不执行代码块';
        break;
    }
  },

  // 显示章节目录
  chapter: function(emotion) {
    let kemuId = this.data.kemuId;
    const ChildList = wx.getStorageSync('ChildrenItem');
    wx.request({
      url: config.reportURL + '/report/getChapterOfParent?classId=' + ChildList.classId + '&subjectId=' + kemuId,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let resName = res.data.data;
        console.log(resName);
        resName = convert(resName, 0);
        resName = IterationDelateMenuChildren(resName);
        this.setData({
          chapterItem: resName,
          knowledge: [],
          whiles: [],
          tasks: []
        });
      }
    })
  },

  // 知识点目录
  knowledge: function(emotion) {
    let kemu = this.data.kemu;
    const ChildList = wx.getStorageSync('ChildrenItem');
    wx.request({
      url: config.itemURL + '/report/queryByKnowledge?stuId=' + ChildList.id + '&classId=' + ChildList.classId + '&subject=' + kemu,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        this.setData({
          knowledge: res.data.data,
          chapterItem: [],
          whiles: [],
          tasks: []
        });
      }
    })
  },

  // 点击章节目录
  chapterTop: function(e) {
    let kemuId = this.data.kemuId;
    const ChildList = wx.getStorageSync('ChildrenItem');
    let chapterTop = e.currentTarget.dataset.item;
    if (chapterTop.chapterAccuracy === null) {
      showToast('暂无数据', null, 1500);
      return;
    }

    wx.request({
      url: config.reportURL + '/report/getHomeworkOfParent?stuId=' + ChildList.id + '&subjectId=' + kemuId + '&chapterId=' + chapterTop.chapterId,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let reself = res.data.data;
        console.log(reself, '>>>>>>>>>>');
        for(let k in reself) {
          reself[k].ownerAnswerTime = formatSeconds(reself[k].ownerAnswerTime)
        }
        this.setData({
          whiles: [],
          tasks: reself,
          chapterItem: []
        })
      }
    })
  },

  // 每份作业
  taskOnBind(e) {
    let ev = e.currentTarget.dataset.item;
    console.log(ev, 'neirong');
    const ChildList = wx.getStorageSync('ChildrenItem');
    if (!ev.submit) {
      showToast('未提交 暂无数据', null, 1000);
      return;
    }
    wx.request({
      url: config.reportURL + '/report/getQuestionByStu?homeworkId=' + ev.homeworkId + '&source=' + ev.source + '&stuId=' + ChildList.id,
      data: { wx: 'wx' },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let resCode = res.data.data;
        for (let k in resCode) {
          if (resCode[k].answerTime == null ) {
            resCode[k].answerTime = '未批改'
            continue;
          }
          resCode[k].answerTime = formatSeconds(resCode[k].answerTime);
          resCode[k].classAvgAnswerTime = formatSeconds(resCode[k].classAvgAnswerTime);
        }
        this.setData({
          whiles: res.data.data,
          tasks: [],
          chapterItem: []
        })
      }
    })
  },

  // 点击知识点
  KnowledgeTop: function(e) {
    let chapterTop = e.currentTarget.dataset.item;
    if (chapterTop.tureRate === null) {
      showToast('暂无数据', null, 1500);
      return;
    }

    let kemu = this.data.kemu;
    let content = e.currentTarget.dataset.item.knowledgelevel3Name;
    const ChildList = wx.getStorageSync('ChildrenItem');
    wx.request({
      url: config.itemURL + '/report/queryStudentOfKnowledge?stuId=' + ChildList.id + '&knowledge=' + content + '&subject=' + kemu,
      data: '',
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let whilesIds = res.data.data;
        for (let k in whilesIds) {
          whilesIds[k].is = false;
        }
        this.setData({
          whiles: whilesIds,
          chapterItem: [],
          knowledge: []
        });
      }
    })
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  }
})