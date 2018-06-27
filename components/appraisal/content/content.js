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
    },
    previewImage(e){
      let the = this;
      let url = e.currentTarget.dataset.artUrl
      the.triggerEvent('preview', {
        url: url
      })
    },
    goDetail(e){
      let artNum = e.currentTarget.dataset.artId;
      wx.navigateTo({
        url: '../appdetail/appdetail?num=' + artNum
      })
    }
  },
  //倒计时
  ready: function () {
  }
})