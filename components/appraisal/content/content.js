const app = getApp();
Component({
  properties: {
    d: {
      type: Object,
      value: "default value"
    },
    index:{
      type: Number,
      value: "111"
    }
  },
  data: {
    mask: true,
    maskCon: false,
    change: '',
    isTime: false, //倒计时是否完成
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
    test: "000000"
  },
  methods: {
    tapName: function () {
      wx.previewImage({
        current: 'https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/PbiwZrwtez/cover.png',
        urls: ["https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/PbiwZrwtez/cover.png", "https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/QsE2h3rkxB/cover.png"] // 需要预览的图片http链接列表
      })
    },
    //点击估价按钮
    appraisal(e) {
      let artNum = e.currentTarget.dataset.artId;
      let the = this;
      let id = app.globalData.getId();
      if (!id) {
        console.log('该登录');
        return false
      }
      the.triggerEvent('maskevent', {
        artNum: artNum
      })
    },
    time(e) {
      let userNum = wx.getStorageSync("userNum");
      let the = this;
      let intervlTime = "";
      let intervlTime1 = "";
      let artNum = e.valueDTO.num;
      let authStamp = (e.authStamp);
      let index = the.data.index;
      let now = Math.floor((new Date()).getTime());
      intervlTime = setInterval(function () {
        if (authStamp <= now) {
          clearInterval(intervlTime)
          return false;
        }
        let Str = {
          userNum: userNum,
          artNum: artNum,
          index:index
        };
        Str = JSON.stringify(Str)
        wx.sendSocketMessage({
          data: Str,
          success() {
          }
        })
        the.receiveData(the);
      }, 3000)
      intervlTime1 = setInterval(() => {
        if (authStamp <= now) {
          clearInterval(intervlTime1);
          the.setData({
            isTime: true
          })
          return false;
        }
        the.getTimer(authStamp)
      }, 1000)
    },
    receiveData(the){
      // console.log("aaaa");
      // wx.onSocketMessage(function (res) {
      //   console.log(the);
      //   the.triggerEvent('eventCon', {
      //     index: resData.data.index,
      //     con: resData.data.art,
      //   })
      //   console.log(the)
      //   console.log(resData.data.art)
      //   the.setData({
      //     change: resData.data.art,
      //     test: "111111111"
      //   })
      // })
    },
    // 倒计时时间
    getTimer(authStamp) {
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
      the.setData({
        days: times.days,
        hours: times.hours,
        minutes: times.minutes,
        seconds: times.seconds
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
    }
  },
  //倒计时
  ready: function () {
    var the = this;
    var data = the.data.d;
    the.setData({
      change: data
    })
    let authStamp = data.authStamp;
    the.getTimer(authStamp)
    the.time(data);
  }
})