//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    isLoading: true,
    items: [],
    page: 1,
    getDataType: "push",
    mask:""
  },
  onLoad() {
    var the = this;
    wx.connectSocket({
      url: 'ws://10.1.25.34:7070/art/info',
      method:'POST'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      the.getTime();
      // wx.sendSocketMessage({
      //   data: msg
      // })
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketMessage(function (res) {
      let resData = JSON.parse(res.data);
      let index = resData.data.index;
      let data = resData.data.art;
      let items =[];
      let valueDTO = "items[" + index + "].valueDTO";
      let award = "items[" + index + "].award";
      let assess = "items[" + index + "].assess";
      let scale = "items[" + index + "].scale";
      let assessData = data.assess ? data.assess:null;
      let scaleData = data.scale ? data.scale : null;
      the.setData({
        [valueDTO]: data.valueDTO,
        [award]: data.award,
        [assess]: assessData,
        [scale]: scaleData,
      })
      console.log(the.data.items)
    })
  },
  onShow() {
    var the = this
    //  wx.request({
    //    url: '',

    //  })
  },
  // 下拉动作
  onPullDownRefresh() {
    var the = this;
    the.setData({
      getDataType: "pull",
      page: 1
    })
    the.getTime()
  },
  // 上拉动作
  onReachBottom() {
    let the = this;
    let page = the.data.page;
    page++
    the.setData({
      getDataType: "push",
      page: page
    })
    the.getTime()
  },
  getTime() {
    let the = this;
    let page = the.data.page;
    let ownerNum = wx.getStorageSync('userNum');
    let dataType = the.data.getDataType;
    the.setData({
      isLoading: false
    })
    wx.request({
      url: app.globalData.url + 'wxapp/ajax/arts ',
      method: 'POST',
      data: {
        currentPage: page,
        ownerNum: ownerNum
      },
      success(res) {
        console.log(res);
        if (res.data.code == 0) {
          if (dataType == 'push') {
            the.push(res.data.data.arts)
          } else {
            the.pull(res.data.data.arts)
          }
          the.setData({
            isLoading: true
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: ""
          })
        }
      },
      fail() {
        wx.showToast({
          title: '网络发生错误',
          icon: "none"
        })
      }
    })
  },
  // 上拉刷新
  push(res) {
    let the = this;
    let arr = the.data.items;
    let length = res.length;
    if (length == 0) return false
    for (var i = 0; i < length; i++) {
      res[i].time = the.timeSlot(res[i].createStamp)
      arr.push(res[i])
    }
    the.setData({
      items: arr
    })
    console.log(the.data.items)
  },
  // 下拉刷新
  pull(res) {
    let the = this;
    let arr = [];
    let length = res.length;
    for (var i = 0; i < length; i++) {
      res[i].time = the.timeSlot(res[i].createStamp)
      arr.push(res[i])
    }
    the.setData({
      items: arr
    })
  },
  timeSlot(time) {
    let the = this;
    let createTime = Math.floor((new Date(time)).getTime() / 1000);
    let now = Math.floor((new Date()).getTime() / 1000);
    let timeSolt = now - createTime;
    let timeCon;
    timeSolt = the.surplusTime(timeSolt);
    switch (true) {
      case (timeSolt.days > 0):
        timeCon = timeSolt.days + '天前';
        break;
      case (timeSolt.hours > 0):
        timeCon = timeSolt.hours + '小时前';
        break;
      case (timeSolt.minutes > 0):
        timeCon = timeSolt.minutes + '分钟前';
        break;
      default:
        timeCon = '刚刚';
    }
    return timeCon;
  },
  //剩余时间
  surplusTime(t) {
    var time = {};
    time.days = parseInt(t / 60 / 60 / 24, 10); //计算剩余的天数
    time.hours = parseInt(t / 60 / 60 % 24, 10); //计算剩余的小时
    time.minutes = parseInt(t / 60 % 60, 10);//计算剩余的分钟
    time.seconds = parseInt(t % 60, 10);//计算剩余的秒数
    return time;
  },
  //监听弹窗
  maskeventListener(e){
    this.setData({
      artNum:e.detail.artNum
    })
  }
})
