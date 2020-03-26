let app = 'http://192.168.1.194/gateway';         // 本地
// let app = 'https://api.epen.ltd';         // 线上
// let app = 'https://api-uat.epen.ltd';      // 测试

// let wss = 'wss://abc.epen.ltd';
// wss://abc.epen.ltd   ws://192.168.1.184:65512

module.exports = {
  baseURL: app + '/auth',
  basisURL: app + '/basis',
  listURL: app + '/question',
  itemURL: app + '/main',
  taskURL: app + '/main',
  errorURL: app + '/error_book',
  reportURL: app + '/report',
  anyuanURL: app + '/question'
  // webSocketURL: wss + '/websocket'
};

