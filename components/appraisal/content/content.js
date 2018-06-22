const app = getApp();
var initial = {
  mask: true,
  maskCon: false,
  RMB: '',  //估价人民币
  multiple: "", //估价的倍数
  pwd: ""
}
Component({
  properties: {
    d: {
      type: Object,
      value: "default value"
    }
  },
  data: {
    mask: true,
    maskCon: false,
    change: '',
    RMB: '',  //估价人民币
    multiple: "", //估价的倍数
    isTime: false, //倒计时是否完成
    pwd: "",
    days: "",
    hours: "",
    minutes: "",
    seconds: ""
  },
  methods: {
    tapName: function () {
      console.log('aaa');
      wx.previewImage({
        current: 'https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/PbiwZrwtez/cover.png',
        urls: ["https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/PbiwZrwtez/cover.png", "https://moochain-art.oss-cn-beijing.aliyuncs.com/production/admin/QsE2h3rkxB/cover.png"] // 需要预览的图片http链接列表
      })
    },
    //点击估价按钮
    appraisal() {
      let the = this;
      let id = app.globalData.getId();
      if (!id) {
        console.log('该登录');
        return false
      }
      the.setData({
        mask: false
      })
    },
    //弹窗取消按钮
    cancel() {
      this.setData(initial)
    },
    //弹窗确认按钮
    sure() {
      let data = this.data;
      if (!data.RMB) {
        wx.showToast({
          title: '填写估价金额',
          icon: 'none'
        })
      } else if (!data.multiple) {
        wx.showToast({
          title: '填写估价倍数',
          icon: 'none'
        })
      } else {
        this.setData({
          maskCon: true
        });
      }
    },
    //弹窗上一步
    prev() {
      this.setData({
        maskCon: false
      })
    },
    // 绑定金额
    bindRMB(e) {
      let val = e.detail.value;
      this.setData({
        RMB: val
      })
    },
    //绑定倍数
    bindMultiple(e) {
      let val = e.detail.value;
      this.setData({
        multiple: val
      })
    },
    //绑定支付密码
    bindPwd(e) {
      let val = e.detail.value;
      this.setData({
        pwd: val
      })
    },
    //提交估价
    sub() {
      let the = this;
      let data = the.data;
      if (!data.pwd) {
        wx.showToast({
          title: '填写支付密码',
          icon: 'none'
        })
      } else {
        wx.showLoading({
          title: "提交中",
          mask: true,
          complete() {
            setTimeout(() => {
              the.setData(initial);
              wx.hideLoading();
            }, 3000)
          }
        })

      }
    },
    time(e) {
      let userNum = wx.getStorageSync("userNum");
      let the = this;
      let intervlTime = "";
      let intervlTime1="";
      let artNum = e.valueDTO.num;
      let authStamp = (e.authStamp);
      let now = Math.floor((new Date()).getTime());
      intervlTime = setInterval(() => {
        if (authStamp <= now) {
          clearInterval(intervlTime)
          return false;
        }
        let  Str = {
          userNum: userNum,
          artNum: artNum
        };
        Str = JSON.stringify(Str)
        wx.sendSocketMessage({
          data: Str
        })
        wx.onSocketMessage(function (res) {
          var resData = JSON.parse(res.data);
          console.log(resData.data.art)
          the.setData({
            change: resData.data.art
          })
        })
      }, 3000)
      intervlTime1 = setInterval(() => {
        if (authStamp <= now) {
          clearInterval(intervlTime1);
          the.setData({
            isTime:true
          })
          return false;
        }
        the.getTimer(authStamp)
      },1000)
    },
    // 倒计时时间
    getTimer(authStamp) {
      authStamp = authStamp/1000;
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