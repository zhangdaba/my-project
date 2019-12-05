import config from './config.js'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 模态框
function showTextModal(title, content, confirmText, success) {
  wx.showModal({
    title: title || '提示',
    content: content || '',
    confirmText: confirmText || '确定',
    success(res) {
      success(res)
    }
  })
}

// 模态框 单选框
function showSingleTextModal(title, content) {
  wx.showModal({
    title: title || '提示',
    content: content || '',
    showCancel: false
  })
}


// 注册登录 提示
function showTextToast(title, duration, icon) {
  wx.showToast({
    title: title || '',
    icon: icon || 'none',
    duration: duration || 1000
  })
}

// get 请求
function getJSON(url, data, success) {
  wx.request({
    url: config.baseURL + url,
    data: data || {},
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      success(res);
    },
    fail: function(res) {},
    complete: function(res) {}
  })
}

// getUser
function getUser(url, data, header, success) {
  wx.request({
    url: config.baseURL + url,
    data: data || {},
    header: header || {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      success(res);
    },
    fail: function(res) {},
    complete: function(res) {}
  })
}

// post 发送
function post(url, data, header, success) {
  wx.request({
    url: config.baseURL + url,
    data: data,
    header: header || {},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      success(res);
    },
    fail: function(res) {},
    complete: function(res) {}
  })
}

function no_token() {

}

// 数据递归
function convert(data, parentIds) {
  var convertData = [];
  data.forEach((item, index) => {
    item.has_res = 0;
    if (item.parentId == parentIds) {
      convertData.push(item);
      convertChildren(data, item, item.chapterId);
    }
  });
  return convertData;
}

// 递归整合
function convertChildren(arr, parentItem, parentIds) {
  parentItem.children = parentItem.children ? parentItem.children : [];
  arr.forEach(item => {
    if (item.parentId == parentIds) {
      parentItem.children.push(item);
      convertChildren(arr, item, item.chapterId);
    }
  });
  return parentItem.children;
}

// 去除空的children目录
function IterationDelateMenuChildren(arr) {
  if (arr.length) {
    for (let i in arr) {
      if (arr[i].children.length) {
        IterationDelateMenuChildren(arr[i].children);
      } else {
        delete arr[i].children;
      }
    }
  }
  return arr;
}

// 函数节流与函数防抖
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) gapTime = 1500;
  let _lastTime = null;
  return function() {
    let _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments);
      _lastTime = _nowTime;
    }
  }
}

// 时间转换 60s 转 01:00
function formatSeconds(value) {

  var theTime = parseInt(value); // 秒

  var middle = 0; // 分

  var hour = 0; // 小时


  if (theTime > 60) {

    // 把每秒 除以 60 得到分钟

    middle = parseInt(theTime / 60);

    theTime = parseInt(theTime % 60);

    if (middle > 60) {

      hour = parseInt(middle / 60);

      middle = parseInt(middle % 60);

    }

  }

  var result = ''
  if (parseInt(theTime) >= 10) {
    result = "0" + ":" + parseInt(theTime);
  } else {
    result = "0" + ":" + "0" + parseInt(theTime);
  }
  if (middle >= 0 && parseInt(theTime) >= 10) {
    result = parseInt(middle) + ":" + parseInt(theTime);
  } else {
    result = parseInt(middle) + ":" + "0" + parseInt(theTime);
  }

  if (hour > 0) {
    result = "" + parseInt(hour) + ":" + result;
  }

  return result;

}

// 设置 tabbar标题
function NavigationBarTitle(barTitle) {
  let title = '';
  switch (barTitle) {
    case 0:
      title = '首页'
      break;
    case 1:
      title = '消息'
      break;
    case 2:
      title = '个人信息'
      break;
    default:
      console.log('后续带留');
      break;
  }
  return title;
}

// 解决图片超出屏幕视口大小
function subjectImg(resName) {
  for (let k in resName) {
    resName[k].title = resName[k].title.replace(/<img/g, '<img style="max-width:100%;height:auto;overflow: auto;"');
  }

  for (let k in resName) {
    resName[k].title = resName[k].title.replace(/style=";"/g, '');
  }

  for (let k in resName) {
    resName[k].title = resName[k].title.replace(/px/g, 'rpx');
  }
};

module.exports = {
  formatTime: formatTime,
  showTextToast: showTextToast,
  getJSON: getJSON,
  post: post,
  showTextModal: showTextModal,
  getUser,
  showSingleTextModal: showSingleTextModal,

  convert: convert, // 递归构建树形结构
  IterationDelateMenuChildren: IterationDelateMenuChildren,
  throttle, // 函数节流与函数防抖
  formatSeconds: formatSeconds,
  NavigationBarTitle,
  subjectImg: subjectImg
}