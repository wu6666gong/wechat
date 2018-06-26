const verify = require("../../../utils/verify.js");
const app = getApp();
let initial = {
  mask: true,
  maskCon: false,
  RMB: '',  //估价人民币
  multiple: "", //估价的倍数
  pwd: "",
  artNum:"",
  restBean:""
}
Component({
  properties:{
    artNum:{
      type: String,
      value:'111'
    },
    artData:{
      type:Object,
      value: '111'
    }
  },
  data:{
    mask:true,
    maskCon: false,
    RMB: '',  //估价人民币
    multiple: "", //估价的倍数
    pwd: "",
  },
  methods:{
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
        let money = wx.getStorageSync("bean");
        if (data.multiple>money){
          wx.showToast({
            title: '您的艺术豆不足',
            icon: 'none'
          })
        }else{
          this.setData({
            maskCon: true,
            restBean: money - data.multiple
          });
        }
       
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
      let artNum = data.artNum;
      let RMB = data.RMB;
      let multiple = data.multiple;
      let pwd = verify.isPwd(data.pwd);
      let userNum = wx.getStorageSync("userNum");
      if (!pwd.judge) {
        wx.showToast({
          title: pwd.val,
          icon: 'none'
        })
      } else {
       
        wx.showLoading({
          title: "提交中",
          mask: true,
          complete() {
            wx.request({
              url: app.globalData.url+'/wxapp/ajax/assess',
              data:{
                userNum: userNum,
                artNum: artNum,
                price: multiple,
                value: RMB,
                password: pwd.val
              },
              method:'POST',
              success(res){
                if(res.data.code == 0 ){
                  let bean = wx.getStorageSync("bean");
                  let price = (Number(bean) * Math.pow(10, 6) - (parseInt(multiple) * Math.pow(10, 6))) / Math.pow(10, 6);
                  wx.setStorageSync("bean", price);
                  wx.showToast({
                    title: '估价成功',
                    icon: 'none',
                  })
                  the.setData(initial);
                  wx.hideLoading();
                }else{
                  wx.hideLoading();
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                  })
                }
              },
              fail(){
                wx.hideLoading();
                wx.showToast({
                  title: "网络发生错误",
                  icon: 'none',
                })
              }
            })
            // setTimeout(() => {
            //   the.setData(initial);
            //   wx.hideLoading();
            // }, 3000)
          }
        })

      }
    }
  },
  ready(){
    
  }
})