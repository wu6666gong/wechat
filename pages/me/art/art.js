const app = getApp();
let page=1;
const id = app.globalData.getId();
const getList =(the)=>{
  the.setData({
    isLoading: false
  })
  wx.request({
    url: app.globalData.url + 'wxapp/ajax/mine',
    method: 'POST',
    data: {
      currentPage: page,
      ownerNum: id
    },
    success(res) {
      console.log(res);
      let l = the.data.list;
      let data = res.data.data.arts;
      let length = data.length;
      if (length==0){
        the.setData({
          isLoading: true
        });
        return
      }
      for (var i = 0; i < length;i++){
        l.push(res.data.data.arts[i]);
      }
      the.setData({
        list: l,
        isLoading: true
      });
      page++;
    },
    fail() {
      
    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:true,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = app.globalData.getId();
    wx.showLoading({
      title: '',
    });
    wx.hideLoading();
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
    var the = this;
    getList(the);
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
    var the = this;
    getList(the);
      
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})