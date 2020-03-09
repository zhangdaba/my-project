import {
  NavigationBarTitle
} from '../../../utils/util.js'

const app = getApp();

// import util from '../../../utils/util.js';
import config from '../../../utils/config.js';

let advImage = [
  '/static/images/home/home.png',
  'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
  'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
];

let badge = 0;

let list = [{
    text: "首页",
    iconPath: "/static/images/tabBar/mine_normal.png",
    selectedIconPath: "/static/images/tabBar/mine_selected.png"
  },
  {
    text: "消息",
    iconPath: "/static/images/tabBar/news_normal.png",
    selectedIconPath: "/static/images/tabBar/news_selected.png",
    badge: badge
  },
  {
    text: "我的",
    iconPath: "/static/images/tabBar/category_normal.png",
    selectedIconPath: "/static/images/tabBar/category_selected.png"
  }
];

Page({
  data: {
    advImage,

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
          selectedIconPath: "/static/images/tabBar/news_selected.png"
        }
      }
    };

    this.tabChange(tab);

    this.userParent();

    this.windowHeight();
  },

  onShow: function () {
    this.setData({
      dialogShow: true
    })
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

  tabChange(e) {
    // console.log('tab change', e.detail);
    this.setData({
      tabChange: e.detail
    });

    wx.setNavigationBarTitle({
      title: NavigationBarTitle(e.detail.index)
    })

    // 实时触发子组件更新
    // if (e.detail.index === 1) {
    // 监听当前页面渲染 需求 负责消息模块的实时数据更新
    // this.my_msgProp = this.selectComponent("#my_msgProp");
    // this.my_msgProp.my_msgProp();
    // } else {
    //   return;
    // }
    // end
  },

  // onReachBottom: function () {
  //   this.my_msgProp = this.selectComponent("#my_msgProp");
  //   this.my_msgProp.my_msgProp();
  // },

  // 获取学生信息
  userParent: function () {
    let _this = this;
    const token = wx.getStorageSync('Token');
    wx.request({
      url: config.basisURL + '/student/getStudent',
      data: '',
      header: {
        Token: token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res);
        let students = res.data.data;
        // 给每个孩子加上index值
        let num = -1;
        for (let i in students) {
          num++;
          students[i].idx = num;
        }
        wx.setStorageSync('Children', students);
        _this.setData({
          studentName: students
        })
      }
    })
  },

  // 选择同学
  pswitch: function (e) {
    let _this = this;
    _this.setData({
      selectChild: true,
      studentName_Idx: e.detail.value || 0 // 当前用户孩子
    });
    let studentNames = _this.data.studentName;
    let ChildrenItem = studentNames[e.detail.value]; //当前孩子
    wx.setStorageSync('ChildrenItem', ChildrenItem);
    const ChildList = wx.getStorageSync('ChildrenItem');
  },

  // 提示
  selectChilds: function () {
    wx.showToast({
      title: '请选择孩子',
      icon: 'none',
      duration: 800
    })
  },

  ParentErrorBook: function (e) {
    let _this = this;
    if (!_this.data.selectChild) {
      _this.selectChilds();
      return;
    }
    wx.navigateTo({
      url: '../../../parent/ErrorBook/andError/andError'
    })
  },

  // 学情报告
  parentInfo: function () {
    let _this = this;
    if (!_this.data.selectChild) {
      _this.selectChilds();
      return;
    }
    wx.navigateTo({
      url: '../../../parent/report/subReport/subReport',
    })
  },

  // 查看作业
  submission: function () {
    let _this = this;
    if (!_this.data.selectChild) {
      _this.selectChilds();
      return;
    }
    wx.navigateTo({
      url: '../../../parent/viewJobs/submission/submiss',
      success: function (res) {}
    })
  },

  nUnRead(e) {
    badge = e.detail;
        
    if(badge > 99) {
      badge = '99+'
    }

    this.setData({
      list: [{
          text: "首页",
          iconPath: "/static/images/tabBar/mine_normal.png",
          selectedIconPath: "/static/images/tabBar/mine_selected.png"
        },
        {
          text: "消息",
          iconPath: "/static/images/tabBar/news_normal.png",
          selectedIconPath: "/static/images/tabBar/news_selected.png",
          badge: badge
        },
        {
          text: "我的",
          iconPath: "/static/images/tabBar/category_normal.png",
          selectedIconPath: "/static/images/tabBar/category_selected.png"
        }
      ]
    });

    console.log(this.data.list);
  }

});