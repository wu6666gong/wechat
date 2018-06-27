const app = getApp();
Page({
  data:{
    bean:0,
    isId: '',
    name:'---',  head:'https://moochain-art.oss-cn-beijing.aliyuncs.com/production/U1508461388039897249/HFrct7yrXB/more_1.png',
    shareNum:0
  },
  //邀请好友
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let userNum = wx.getStorageSync("userNum");
    return {
      title: '快来 Artval，给艺术品估价，猜对有奖',
      path: 'pages/me/login/login?userNum=' + userNum,
      imageUrl: "https://moochain-art.oss-cn-beijing.aliyuncs.com/production/U1508461388039897249/CmAj76MytZ/more_3.jpg"
    }
  },
  onShow(){
    var the = this;
    let id = app.globalData.getId();
    the.setData({
      isId: id
    })
    if(!id){
      return false
    }
    wx.request({
      url: app.globalData.url +'wxapp/info',
      method:'POST',
      data:{
        num: id
      },
      success(res){
        if(res.data.code == 0){
          let data = res.data.data.userInfo;
          let shareNum = res.data.data.people;
          the.setData({
            name: data.nickName,
            bean: data.money,
            head: data.headPic,
            shareNum: shareNum
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
       
      },
      fail(){
        wx.showToast({
          title: '网络错误',
          icon:'none'
        })
      }
    })
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           the.setData({
    //             ifLogin: true,
    //             name: res.userInfo.nickName,
    //             head: res.userInfo.avatarUrl
    //           })  
    //         }
    //       })
    //     }else{
    //       the.setData({
    //         ifLogin: false
    //       })  
    //     }
    //   }
    // })
  }
  // bindGetUserInfo: function (e) {
  //   var the = this;
  //   app.globalData.goUnionid(e, function (detail){
  //     the.setData({
  //       ifLogin: true,
  //       name: detail.nickName,
  //       head: detail.avatarUrl
  //     })  
  //   });
  
  // }
})