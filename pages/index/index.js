//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    isLoading:true
  },
  onShow(){

  },
  onReachBottom: function () {
    var the = this;
    the.setData({
      isLoading: false
    })
    setTimeout(()=>{
      the.setData({
        isLoading: true
      })
    },3000)
   //下拉刷新
  }
})
