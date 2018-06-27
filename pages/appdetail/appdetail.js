const app = getApp()
let intervalTime1, intervalTime2;
Page({
  data: {
    items: [],
    artNum: "",
    isCanvas: false,
    artPrice: "",
    canvas: [],
    urls:[]
  },
  onLoad(e) {
    this.connectSocket()
    let num = e.num;
    let ownerNum = wx.getStorageSync('userNum');
    this.setData({
      artPrice: num
    })
    this.postData(num, ownerNum)
  },
  //监听弹窗
  maskeventListener(e) {
    this.setData({
      artNum: e.detail.artNum,
      artData: e.detail.artData
    })
  },
  eventImage: function (e) {
    let url = e.url;
    let urls = this.data.urls;
    wx.previewImage({
      current: url,
      urls: urls// 需要预览的图片http链接列表
    })
  },
  //连接websocket
  connectSocket() {
    wx.connectSocket({
      url: 'ws://10.1.25.34:7070/art/info',
      method: 'POST'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')

    })
  },

  socketMessage(index) {
    var the = this;
    wx.onSocketMessage(function (res) {
      let resData = JSON.parse(res.data);
      let data = resData.data.art;
      if (resData.data.prices) {
        the.setData({
          canvas: resData.data.prices
        })
        the.canvas()
        clearInterval(intervalTime1)
        clearInterval(intervalTime2)
      }
      let valueDTO = "items[" + 0 + "].valueDTO";
      let award = "items[" + 0 + "].award";
      let assess = "items[" + 0 + "].assess";
      let scale = "items[" + 0 + "].scale";
      let assessData = data.assess ? data.assess : null;
      let scaleData = data.scale ? data.scale : null;
      the.setData({
        [valueDTO]: data.valueDTO,
        [award]: data.award,
        [assess]: assessData,
        [scale]: scaleData,
      })
    })
  },
  postData(num, ownerNum) {
    let the = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.url + 'wxapp/ajax/detail',
      method: 'POST',
      data: {
        num: num,
        ownerNum: ownerNum
      },
      success(res) {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 0) {
          if (res.data.data.prices) {
            the.setData({
              canvas: res.data.data.prices
            })
            the.canvas()
          }
          the.push(res)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      },
      fail() {
        wx.hideLoading();
      }
    })
  },
  push(res) {
    let data = res;
    res = res.data.data.art;
    let arr = [];
    let urls = [];
    let the = this;
    res.istime = 1000;
    arr.push(res)
    urls.push(res.artDTO.cover);
    if (res.artDTO.antiFakes){
      res.artDTO.antiFakes.forEach((item)=>{
        urls.push(item);
      })
    }
    the.setData({
      items: arr,
      urls: urls
    })
    if (data.data.data.prices) {
      return false
    }
    the.time(res)
  },
  time(e) {
    let the = this;
    let index = e.index;
    let artNum = e.valueDTO.num;
    let authStamp = (e.authStamp);
    let userNum = wx.getStorageSync("userNum");
    intervalTime1 = setInterval(function () {
      let Str = {
        userNum: userNum,
        artNum: artNum
      };
      Str = JSON.stringify(Str)
      wx.sendSocketMessage({
        data: Str,
        success() {
        }
      })
    }, 3000)
    intervalTime2 = setInterval(() => {
      let now = Math.floor((new Date()).getTime());
      if (authStamp + 1000 <= now) {
        clearInterval(intervalTime2);
        return false;
      }
      the.getTimer(authStamp, 0)
    }, 1000)
  },
  // 倒计时时间
  getTimer(authStamp, index) {
    authStamp = authStamp / 1000;
    let the = this;
    let now = Math.floor((new Date()).getTime() / 1000);
    let time = authStamp - now;
    let times = the.surplusTime(time);
    times.days = the.checkTime(times.days);
    times.hours = the.checkTime(times.hours);
    times.minutes = the.checkTime(times.minutes);
    times.seconds = the.checkTime(times.seconds);
    times.now = now;

    let days = "items[" + index + "].days";
    let hours = "items[" + index + "].hours";
    let minutes = "items[" + index + "].minutes";
    let seconds = "items[" + index + "].seconds";
    let istime = "items[" + index + "].istime";
    the.setData({
      [days]: times.days,
      [hours]: times.hours,
      [minutes]: times.minutes,
      [seconds]: times.seconds,
      [istime]: time
    })
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
  //将0-9的数字前面加上0，例1变为01
  checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  onUnload() {
    clearInterval(intervalTime2)
    wx.closeSocket()
  },
  onReady() {

  },
  canvas() {
    var the = this;
    var arr = the.data.canvas;
    var arrLength = arr.length;
    var arr1 = [], arr2 = [];
    for (var i = 0; i < arrLength; i++) {
      arr1.push(arr[i][0]);
      arr2.push(arr[i][1]);
    }
    var xMax = Math.max.apply(Math, arr1);
    var yMax = Math.max.apply(Math, arr2);
    xMax = Math.ceil(xMax);
    yMax = Math.ceil(yMax);
    var ctx = wx.createCanvasContext('firstCanvas');
    var distX = (xMax / 5) * Math.pow(10, 6);
    var distY = (yMax / 5) * Math.pow(10, 6);
    ctx.beginPath();
    //竖轴
    ctx.beginPath();
    ctx.moveTo(20, 250);
    ctx.lineWidth = "2";
    ctx.font = "12px Arial";
    ctx.fillText('0', 8, 260);
    ctx.fillText('艺术豆', 30, 15);
    ctx.lineTo(20, 10);
    ctx.stroke();
    for (var i = 0; i <= 5; i++) {
      ctx.beginPath();
      ctx.textAlign = "start";
      var y = 250 - 48 * i;
      ctx.moveTo(20, y);
      var lineNum = (distY * i) / Math.pow(10, 6)
      if (i != 0) {
        ctx.fillText(lineNum, 0, y + 4);
      }
      ctx.lineTo(25, y);
      ctx.stroke();
    }
    //横轴
    ctx.beginPath();
    ctx.moveTo(20, 250);
    ctx.font = "12px Arial";
    ctx.fillText('价格(k)', 280, 240);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = "2";
    ctx.lineTo(306, 250);
    ctx.stroke();
    for (var i = 0; i <= 5; i++) {
      ctx.beginPath();
      var x = 20 + 57 * i;
      ctx.textAlign = "center";
      ctx.moveTo(x, 250);
      var lineNum = (distX * i) / Math.pow(10, 6);
      if (i != 0) {
        ctx.fillText(lineNum, x, 264);
      }
      ctx.lineTo(x, 245);
      ctx.stroke();
    }
    // 离散的点
    for (var i = 0; i < arrLength; i++) {
      var arcX = (arr[i][0] / xMax) * 286;
      var arcY = (arr[i][1] / yMax) * 240;
      ctx.moveTo(20 + arcX, 250 - arcY);
      ctx.arc(20 + arcX, 250 - arcY, 2, 0, 2 * Math.PI, false);
    }
    ctx.fillStyle = "rgba(51,166,149,0.7)";
    ctx.fill();
    // ctx.beginPath()
    // ctx.moveTo(10,250);
    // ctx.lineTo(300, 250);
    // ctx.stroke()
    //竖立轴
    // context.beginPath();
    // context.moveTo(10,10);
    // context.lineTo(0,240);
    // context.draw();
    // context.stroke();
    //描边路径
    ctx.draw();
    the.setData({
      isCanvas: true
    })
  }

})