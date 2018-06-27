const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let artNum = options.artNum;
    console.log(artNum);
    if (!artNum){
      wx.showModal({
        title: '友情提示',
        content: '请让分享者分享改艺术品的详情，然后查件价格列表',
      })
      return false;
    }
    this.requestData(artNum);
  },
  requestData(artNum){
      let the = this;
      wx.showLoading({
        title: '加载中...'
      })
      wx.request({
        url: app.globalData.url+'wxapp/ajax/price',
        method:'POST',
        data:{
          artNum: artNum
        },
        success(e){
          wx.hideLoading()
          if(e.data.code == 0){
            the.setData({
              items: e.data.data.userPrices
            })
          }
          console.log(e);
        },
        fail(){
          wx.hideLoading()
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})