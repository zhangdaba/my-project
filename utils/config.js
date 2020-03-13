// let app = 'https://abc.epen.ltd';

let app = 'http://192.168.1.194';

// let app = 'http://47.103.35.30';

// let wss = 'wss://abc.epen.ltd';
// wss://abc.epen.ltd   ws://192.168.1.184:65512

module.exports = {
  baseURL: app + '/gateway/auth',
  basisURL: app + '/gateway/basis',
  listURL: app + '/gateway/question',
  itemURL: app + '/gateway/main',
  taskURL: app + '/gateway/main',
  errorURL: app + '/gateway/error_book',
  reportURL: app + '/gateway/report',
  anyuanURL: app + '/gateway/question'
  // webSocketURL: wss + '/websocket'
};