const app = getApp();

import util from '../../../utils/util.js';
// import config from '../../../utils/config.js';

let list = [{
    text: "首页",
    iconPath: "/static/images/tabBar/mine_normal.png",
    selectedIconPath: "/static/images/tabBar/mine_selected.png"
  },
  {
    text: "消息",
    iconPath: "/static/images/tabBar/news_normal.png",
    selectedIconPath: "/static/images/tabBar/news_selected.png"
  },
  {
    text: "我的",
    iconPath: "/static/images/tabBar/category_normal.png",
    selectedIconPath: "/static/images/tabBar/category_selected.png"
  }
];

let advImage = [{
  url: '/static/images/home/home.png'
}]

Page({
  data: {
    // 家长端
    advImage,
    indicatorColor: 'white',
    indicatorActivecolor: '#F69D11',
    autoplay: false,
    interval: 5000,
    duration: 1000,

    // 家长端
    dialogShow: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    tabChange: {},
    list: list,
    windowHeight: null
  },

  onLoad() {
    let tab = {
      detail: {
        index: 0,
        item: {
          text: "首页",
          iconPath: "/static/images/tabBar/news_normal.png",
          selectedIconPath: "/static/images/tabBar/news_selected.png",
          badge: "New"
        }
      }
    };
    this.windowHeight();
    this.tabChange(tab);
  },

  windowHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          windowHeight: res.windowHeight
        });
      }
    })
  },

  onShow: function() {
    this.setData({
      dialogShow: true
    })
  },

  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
      showOneButtonDialog: false
    })
  },

  // onReachBottom: function () {
  //   this.my_msgProp = this.selectComponent("#my_msgProp");
  //   this.my_msgProp.my_msgProp();
  // },

  // tabbar
  tabChange(e) {
    this.setData({
      tabChange: e.detail
    });

    wx.setNavigationBarTitle({
      title: util.NavigationBarTitle(e.detail.index)
    });
  },

  //布置作业
  task: function() {
    wx.navigateTo({
      url: '../../../home/homeworkAssignment/assignment/assignment',
    })
  },

  // 跳转为教师端错题本
  teacherError: function() {
    wx.navigateTo({
      url: '../../../home/teacherError/error/error',
    })
  },

  // 批改页面
  correction: function() {
    wx.navigateTo({
      url: '../../../home/homeworkCorrecting/Correction/correction',
      success: function(res) {}
    })
  },

  // 学情报告
  teacherInfo: function() {
    wx.navigateTo({
      url: '../../../home/Report/Report/Report'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '智能笔小程序',
      desc: '智能笔',
      path: '/pages/home/home',
      imageUrl: "../../static/images/04.png",
      success: (res) => {
        console.log("转发成功", JSON.stringify(res));
      },
      fail: (res) => {
        console.log("转发失败", JSON.stringify(res));
      }
    }
  },
});