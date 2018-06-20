const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCon:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    const the = this;
    const id = app.globalData.getId();
    wx.request({
      url: app.globalData.url +'wxapp/ajax/security',
      method:'POST',
      data:{
        num: id
      },
      success(res){
        console.log(res)
        the.setData({
          showCon:res.data.data.flag
        })
      },
      fail(){
        wx.showToast({
          title: "发生未知错误",
          icon:"none"
        })
      }
    })
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