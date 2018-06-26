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
    },
    route:{
      type:String,
      value: "other"
    },
    detail:{
      type:Boolean,
      value:false
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
      let artData = e.currentTarget.dataset.artData;
      let the = this;
      let id = app.globalData.getId();
      if (!id) {
        console.log('该登录');
        return false
      }
      the.triggerEvent('maskevent', {
        artNum: artNum,
        artData: artData
      })
    }
  },
  //倒计时
  ready: function () {
  }
})