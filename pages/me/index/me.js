const app = getApp();
Page({
  data:{
    ifLogin:true,//是否授权
    bean:0,
    name:'',
    head:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow(){
    var the = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              the.setData({
                ifLogin: true,
                name: res.userInfo.nickName,
                head: res.userInfo.avatarUrl
              })  
            }
          })
        }else{
          the.setData({
            ifLogin: false
          })  
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    var the = this;
    app.globalData.goUnionid(e,function(){
      the.setData({
        ifLogin: true,
        name: e.detail.userInfo.nickName,
        head: e.detail.userInfo.avatarUrl
      })  
    });
  
  }
})