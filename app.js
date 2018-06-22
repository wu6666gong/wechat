//app.js
App({
  onLaunch: function () {
    var the = this;
    //判断是否登录
      wx.checkSession({
        success:function(){
          console.log(1)
        },
        fail:function(){
           the.goLogin();
        }
      })
  },
  goLogin(){
    var the = this;
    wx.showLoading({
      title: '',
      mask:true
    })
    //用户登录
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          console.log(res.code);
          wx.request({
            url: the.globalData.url+'wxapp/login',
            method:"POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: JSON.stringify({
              code:res.code
            }),
            success:function(res){
              var logs = wx.getStorageSync('logs') || {};
              console.log(res);
              logs.openId = res.data.data.openId
              wx.setStorageSync('logs',logs);
              wx.setStorageSync('userNum', res.data.data.userNum);
            },
            fail:function(){
              the.loginError();
            },
            complete:function(){
              wx.hideLoading();
            }
          })
        } else {
          the.loginError();
        }
      }
    });
  },
  onShow: function () {
  },
  loginError:function(){
    wx.navigateBack({
      delta: 0
    })
  },
  globalData: {
    url:"http://10.1.25.34:7070/",
    goUnionid:function(e,callback){
      var the = this;
      var data = e.detail;
      var detail = data.userInfo;
      delete data.errMsg;
      delete data.userInfo;
      let openId = wx.getStorageSync('logs').openId;

      data.openId = openId;
      wx.showLoading({
        title: '',
      })
      wx.request({
        url: the.url+'wxapp/info',
        method:"POST",
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: JSON.stringify(data),
        success:function(e){
          wx.hideLoading();
          console.log(e);
          callback(detail);
        },
        fail:function(){
          wx.hideLoading();
          wx.showToast({
            title: '请检查网络或者重启小程序',
            icon:"none"
          })
        },
        complete:function(){
        }
      })
    },
    getId() {
      var id = wx.getStorageSync('userNum');
      return id;
    },
    getUnionId(){
      var id = wx.getStorageSync('logs').openId;
      return id;
    }
  }
})
// App({
//   onLaunch: function () {
//     // 展示本地存储能力
//     var logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)

//     // 登录
//     wx.login({
//       success: res => {
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       }
//     })
//     // 获取用户信息
//     wx.getSetting({
//       success: res => {
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
//           wx.getUserInfo({
//             success: res => {
//               // 可以将 res 发送给后台解码出 unionId
//               this.globalData.userInfo = res.userInfo

//               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//               // 所以此处加入 callback 以防止这种情况
//               if (this.userInfoReadyCallback) {
//                 this.userInfoReadyCallback(res)
//               }
//             }
//           })
//         }
//       }
//     })
//   },
//   globalData: {
//     userInfo: null
//   }
// })