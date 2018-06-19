const app = getApp();
Page({
  data:{
    ifLogin:true,//是否授权
    bean:0,
    name:'',
    head:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '邀请好友',
      path: 'pages/me/index/index',
      imageUrl: "https://moochain-art.oss-cn-beijing.aliyuncs.com/test/U1508461388039897249/ypRRNxD7e2/more_1.jpg"
    }
  },
  onShow(){
    var the = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
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
    app.globalData.goUnionid(e, function (detail){
      the.setData({
        ifLogin: true,
        name: detail.nickName,
        head: detail.avatarUrl
      })  
    });
  
  }
})