Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    const ctx = wx.createCanvasContext('myCanvas')
    this.setData({
      ctx: ctx
    })
    //注意这里的 canvas 要与wxml文件的canvas-id属性命名一样
    ctx.drawImage('./../../static/images/04.png', 0, 0, 150, 100)
    ctx.beginPath()
    ctx.moveTo(160, 160)
    ctx.lineTo(180, 180)
    ctx.lineTo(70, 75)
    ctx.setStrokeStyle('#f00')
    ctx.stroke()
    // ctx.draw(true, self.aaa())
    ctx.draw(true, function() {
      self.aaa()
    })
  },

  canvasId() {
    let self = this;
    this.data.ctx.draw(true, function() {
      self.aaa()
    })
  },

  aaa() {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 400,
      height: 400,
      destWidth: 0,
      destHeight: 0,
      canvasId: 'myCanvas',
      success(res) {
        wx.previewImage({
          current: res.tempFilePath,
          urls: [res.tempFilePath]
        })
      }
    })
  }

})