import config from '../../../utils/config.js';
import { subjectImg } from '../../../utils/util.js';

let history = [];

Page({

  data: {

    books: [], // 从题库拿到的题

    newBooks: [], //用户选择的数据

    // 多选，单选，全选，全部选
    management_good: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '出题中'
    });
    this.generative(); //获取生成的题型
  },

  // 从题库获取到题渲染页面
  generative: function() {
    let _this = this;
    // 知识点获取
    let chapItem = wx.getStorageSync('chapItem');

    // 获取题型和数量json
    let taskDataNumber = wx.getStorageSync('taskDataNumber');

    // 获取百分比json
    let newArr = wx.getStorageSync("newArr");

    // 出题策略
    const setting = wx.getStorageSync('setting');
    for (let k in setting.questionType) {
      delete setting.questionType[k].questionType
    }

    // 获取占比例
    let item = {
      'chapterId': chapItem.id, //知识点获取
      'coefficient': setting.difficult, // 难易程度 和 对应的数量
      'questionTypeList': setting.questionType, // 获取题型和数量
      'wx': 'wx'
    };

    wx.request({
      url: config.listURL + '/message/getQ2',
      data: item,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.code === 200) {
          let resName = res.data.data;
          
          subjectImg(resName);

          setTimeout(function() {
            wx.hideLoading()
          }, 800);
          
          _this.setData({
            books: resName
          });
        }
      }
    })
  },

  // 换题
  management: function() {
    let _this = this;
    _this.setData({
      management_good: true,
      newBooks: []
    });
  },

  // 确定换题
  finish_management: function() {

    let _this = this;
    _this.setData({
      management_good: false
    });

    let newBooksLength = _this.data.newBooks.length;

    if (!newBooksLength) {
      return;
    }

    let booksAnd = _this.data.books;

    let newBooksAnd = JSON.stringify(booksAnd, ['diff', 'flag', 'index', 'questionId', 'knowledgeId', 'questionTypeId']);

    let parseBooksAnd = JSON.parse(newBooksAnd);

    let chapItem = wx.getStorageSync('chapItem');

    let c = {
      "chapterId": chapItem.id,
      "historyQuestionId": history,
      "questionParameters": parseBooksAnd,
      wx: "wx"
    }

    wx.request({
      url: config.anyuanURL + '/message/getNewChangeQue',
      data: c,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        if (res.data.code == 200) {
          //需要换题的数据
          let newBook = _this.data.books;

          let newRes = res.data.data;
          //从题库拿到的题目保存到数组中
          for (let k in newRes) {
            history.push(newRes[k].questionId);
          }

          for (let i in newBook) {
            for (let k in newRes) {
              if (newBook[i].index == newRes[k].index) {
                newBook[i] = newRes[k]
              }
            }
          }
          
          _this.setData({
            books: newBook
          })

        } else if (res.data.code == 3012) {

          let newBook = _this.data.books;

          for (let k in newBook) {
            newBook[k].flag = false;
          }

          _this.setData({
            books: newBook
          })

          wx.showToast({
            title: '没有更多的题可以再换了！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    });
  },

  // 选择换题的内容
  select: function(e) {
    let _this = this;
    let newBooks = [];
    // 判断当前状态是否为 编辑状态
    if (!_this.data.management_good) {
      return;
    } else {

      // 题目的数据
      let books = _this.data.books;

      //每道题目的索引
      let indx = e.currentTarget.dataset.idx;
      //点击题目后将flag取反
      books[indx].flag = !books[indx].flag;

      // 给当前集合加索引
      let num = 0;
      for (let k in books) {
        num++;
        books[k].index = num;
      }
      // 过滤完成的数据 配合 加上 上次选择的数据

      // 用户选择的内容
      for (let i = 0; i < books.length; i++) {
        if (books[i].flag) {
          newBooks.push(books[i]);
        }
      };

      _this.setData({
        books,
        newBooks: newBooks
      });
    }
  },

  // 点击布置
  Arrangement: function(e) {

    let _this = this;
    let booksData = _this.data.books;
    let bookItem = JSON.stringify(booksData, ['questionTypeId', 'questionId']);
    let bookItemName = JSON.parse(bookItem);
    let num = 0;
    for (let k in bookItemName) {
      num++;
      bookItemName[k].index = num;
    };
    
    let bookfilter = bookItemName;

    // 本地缓存要布置的作业
    wx.setStorageSync('assignment', bookfilter);

    wx.navigateTo({
      url: '../setTime/setTime',
    });
  }

})