//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    isLoading:true,
    container:[]
  },
  onLoad(){
    console.log('load');
    wx.connectSocket({
      url: 'ws://10.1.25.34:7070/websocket'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      wx.sendSocketMessage({
        data: msg
      })
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })
  },
  onShow(){
    console.log('aaaa');
    var the = this
    //  wx.request({
    //    url: '',
       
    //  })
  },
  onReachBottom: function () {
    // var the = this;
    // the.setData({
    //   isLoading: false
    // })
    // setTimeout(()=>{
    //   the.setData({
    //     isLoading: true
    //   })
    // },3000)
   //下拉刷新
  }
})
