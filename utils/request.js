import config from './config.js';

function getJSON() {
  wx.request({
    url: config.baseURL + url,
    data: data || {},
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      success(res);
    },
    fail: function (res) {},
    complete: function (res) {}
  })
}

function fetch (parmas) {
  let header = {}
  if(parmas.needToken) token = wx.getStorageSync('token')
  return new Promise(function (resolve,reject) {
    wx.request({
      url:parmas.url,
      data:parmas.data,
      header:{
        ...header,
        ...parmas.header
      },
      method: parmas.method || 'GET',
      success:(res)=>{
        resolve(res.data)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  });
}

module.exports = {
  fetch
}